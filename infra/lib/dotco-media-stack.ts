import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CacheQueryStringBehavior,
  CachedMethods,
  Distribution,
  HttpVersion,
  PriceClass,
  ResponseHeadersPolicy,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface DotCoMediaStackProps extends StackProps {
  certificateArn?: string;
  mediaDomainName?: string;
}

export class DotCoMediaStack extends Stack {
  constructor(scope: Construct, id: string, props: DotCoMediaStackProps = {}) {
    super(scope, id, props);

    if (Boolean(props.certificateArn) !== Boolean(props.mediaDomainName)) {
      throw new Error("certificateArn and mediaDomainName must be supplied together");
    }

    const mediaBucket = new Bucket(this, "MediaBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: true,
    });

    const mediaCachePolicy = new CachePolicy(this, "MediaCachePolicy", {
      cachePolicyName: "dotco-production-media-immutable-v1",
      comment: "Immutable media under the versioned site-media/v1 prefix",
      cookieBehavior: CacheCookieBehavior.none(),
      defaultTtl: Duration.days(365),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      headerBehavior: CacheHeaderBehavior.none(),
      maxTtl: Duration.days(365),
      minTtl: Duration.days(1),
      queryStringBehavior: CacheQueryStringBehavior.none(),
    });

    const mediaResponseHeadersPolicy = new ResponseHeadersPolicy(this, "MediaResponseHeadersPolicy", {
      responseHeadersPolicyName: "dotco-production-media-cors-v1",
      comment: "Allow public website media to be sampled by canvas and WebGL clients",
      corsBehavior: {
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ["*"],
        accessControlAllowMethods: ["GET", "HEAD"],
        accessControlAllowOrigins: ["*"],
        accessControlExposeHeaders: ["ETag"],
        accessControlMaxAge: Duration.days(1),
        originOverride: true,
      },
    });

    const certificate = props.certificateArn
      ? Certificate.fromCertificateArn(this, "MediaCertificate", props.certificateArn)
      : undefined;
    const distribution = new Distribution(this, "MediaDistribution", {
      certificate,
      comment: ".CO production website media",
      defaultBehavior: {
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: mediaCachePolicy,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
        compress: true,
        origin: S3BucketOrigin.withOriginAccessControl(mediaBucket),
        responseHeadersPolicy: mediaResponseHeadersPolicy,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: props.mediaDomainName ? [props.mediaDomainName] : undefined,
      enableIpv6: true,
      httpVersion: HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: PriceClass.PRICE_CLASS_ALL,
    });

    new CfnOutput(this, "MediaBucketName", { value: mediaBucket.bucketName });
    new CfnOutput(this, "MediaDistributionId", { value: distribution.distributionId });
    new CfnOutput(this, "MediaDistributionDomainName", { value: distribution.distributionDomainName });
    new CfnOutput(this, "MediaBasePath", { value: "/site-media/v1" });
  }
}
