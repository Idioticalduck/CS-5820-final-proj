import fs from 'fs'
import  readline from 'readline'




export const readEmails=(filename) =>{return new Promise((resolve,reject)=>{
    const rl = readline.createInterface({
        input: fs.createReadStream(filename),
        output: process.stdout,
        terminal: false
      });
    const emails=[]


    rl.on('line', (line) => {
        const email=line.trim()
        emails.push(email)
  });
  console.log()
  console.log(emails)
  
  rl.on('close', () => {
    resolve(emails);  // Resolve the promise once the file has been processed
  });

  rl.on('error', (err) => {
    reject(err);  // Reject the promise in case of error
  });

})}

export const addEmail=(email,filename)=>{return new Promise((resolve,reject)=>{
    const data='\n'+email
    {fs.writeFile(filename, data, { encoding: 'utf8', flag: 'a' }, (err) => {
    if (err) {
      console.log('Error writing to file', err);
      reject(err)
    } else {
      console.log('Data has been appended to the file!');
      resolve(email)
    }
  });
}
  })}

export const editEmail=async (email,newemail,filename)=>{
  return new Promise(async(resolve,reject)=>{
    let emails = await readEmails(filename)
    console.log(email,newemail)
    if (newemail!='') emails[emails.indexOf(email)]=newemail
    else 
   emails= emails.filter(mail=>mail!=email)
  
    console.log(emails)
  
    const contents=emails[0]+emails.slice(1).reduce((acc,emaill)=>{
      const line='\n'+emaill
      acc+=line
      return acc
    }
    ,'')
    
    fs.writeFile(filename,contents,{encoding:'utf-8'},(err)=>{
      if (err){
        console.log('error:',err)
      } else{
        console.log('success')
        resolve(1)
      }
    })

  })
  

}



  