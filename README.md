# TestForNFTDubai
This API example is a database using Node Js, express and MongoDB

Two Collection are created, one for companies and the other for phones
So that there is one company and under it their phone list

http://localhost:8080/ for inser / show Data


<Device> : If you enter the device name, it will be displayed
<User>   : Select the user as admin. Grant permission
Get All Data
http://localhost:8080/api/DeviceWithCompany/<User>/<Device> 

Get Device Only
http://localhost:8080/api/Device/<User>/<Device>

