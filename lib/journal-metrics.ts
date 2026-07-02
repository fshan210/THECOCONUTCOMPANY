export function calculateJournalMetrics(itemCount:number){
  return {
    synergy:Math.min(98,48+itemCount*11),
    hydration:Math.min(96,55+itemCount*9),
    plastic:itemCount*4,
  };
}
