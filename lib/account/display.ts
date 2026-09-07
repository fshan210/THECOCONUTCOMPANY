export function orderStatusLabel(status: string) {
 const labels: Record<string,string> = {PENDING_PAYMENT:"Awaiting payment",PROCESSING:"Processing",SHIPPED:"Shipped",IN_TRANSIT:"In transit",DELIVERED:"Delivered",CANCELLED:"Cancelled"};
 return labels[status.toUpperCase()] ?? "Update pending";
}
export function orderStep(status:string) {return ["PENDING_PAYMENT","PROCESSING","SHIPPED","IN_TRANSIT","DELIVERED"].indexOf(status.toUpperCase());}
export function accountDate(value?:string) {if(!value)return "Date unavailable";const date=new Date(value);return Number.isNaN(date.getTime())?"Date unavailable":new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(date);}
export function accountMoney(value?:number,currency="INR") {if(value==null||!Number.isFinite(value))return "Total unavailable";try{return new Intl.NumberFormat("en-IN",{style:"currency",currency,maximumFractionDigits:2}).format(value);}catch{return "Total unavailable";}}
