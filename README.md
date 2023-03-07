# 5SIM

This is an unofficial wrapper around the 5SIM API calls with TypeScript support.
Forked from [nickpick42/FiveSim](https://github.com/nickpick42/FiveSim).

## Installation
https://www.npmjs.com/package/fivesim_ts
Use the package manager [npm](https://www.npmjs.com/) to install 5sim.

```bash
npm install fivesim_ts
```
##Recommended Usage

```javascript
const FiveSim = require("../main");

let main = async ()=> {

    let apiKey = "API_KEY_HERE"
    let SimTesting = new FiveSim(apiKey)
    let numberRequest = await SimTesting.getAuthorizationNumber('any','any','google')
    let phoneNumber = numberRequest.phone //Generated phone number
    //await page.type("input[name='phone_number']",phoneNumber)
    let code = await SimTesting.waitForCode().then( verificationCode => verificationCode)
    if ( code === undefinded){
        // await SimTesting.banNumber() OR  await SimTesting.finishOrder() (NO code recieved)
    }else{
         //await page.type("input[name='verification_code']",code)
    }
   
}
main()

```




##Manual Usage

```javascript
const FiveSim = require("../main");

let main = async ()=> {
    let apiKey = "PUT_API_KEY_HERE"
    let SimTesting = new FiveSim(apiKey)
    let numberRequest = await SimTesting.getAuthorizationNumber('any','any','google')
    let phoneNumber = numberRequest.phone //Generated phone number
    let id = numberRequest.id //Id to check order
    let check = await SimTesting.checkOrder(id)
    let code = check.sms[0].code//Recieved Code
    let finish = await SimTesting.finishOrder(id)// Finish order if successful
    console.log(finish)

}
main()
```

## Contributing
Huge thank you to the creators of 5sim. The API endpoints are extremely easy to use and thought I would do my part and upload a basic wrapper around the endpoints. Please contact me for any requested changes or updates. 
Forked from [nickpick42/FiveSim](https://github.com/nickpick42/FiveSim).
Added TS Support for testing. Make an issue if not work.


## License
[MIT](https://choosealicense.com/licenses/mit/)
