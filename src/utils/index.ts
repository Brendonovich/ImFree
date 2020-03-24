import XDate from "xdate";

export const getMonday = (date: XDate) => {
  var day = date.getDay(),
    diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return date.setDate(diff);
};
  
export const toLocalTimeString = time => {
  const parts = time.split("-");
  
  let hasMins = parts.map(str => str.includes(":"))
  
  let dates = []
  
  hasMins.forEach((has : boolean, index : number) => {
    if(has){
      let split = parts[index].split(":");
      dates.push(new XDate(2000, 0, 0, split[0], split[1], 0, 0, true).setUTCMode(false))
    }
    else dates.push(new XDate(2000, 0, 0, parts[index], 0, 0, 0, true).setUTCMode(false))
  })
  
  
  const areSameHalf = dates[0].toString("TT") == dates[1].toString("TT");
  const postFix = dates[0].toString("TT");
  
  if(areSameHalf) return dates[0].toString("h(:mm)") + " - " + dates[1].toString("h(:mm)") + postFix
  else return dates[0].toString("h(:mm)TT") + " - " + dates[1].toString("h(:mm)TT")
}

export const zeroPad = (value, amount = 2, str = "0") => value.toString().padStart(amount, str);

export const hhMM = (time : string, utc = false): XDate=> {
  let split = time.split(":");
  return new XDate(0, 0, 0, parseInt(split[0]), parseInt(split[1]), 0, 0, utc)
}
 
export const userPictureURL = (fbId: string) : string => `https://graph.facebook.com/${fbId}/picture?width=300`

export const docToData = (...docs: firebase.firestore.DocumentSnapshot[]) : any => docs.map(doc => doc.data())