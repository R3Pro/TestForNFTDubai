# TestForNFTDubai
This API example is a database using Node Js, express and MongoDB

Two Collection are created, one for companies and the other for phones
So that there is one company and under it their phone list

http://localhost:8080/ for inser / show Data


%Device% : If you enter the device name, it will be displayed

%User%   : Select the user as admin for Grant permission

Get All Data

http://localhost:8080/api/DeviceWithCompany/ %User% / %Device% 

Get Device Only

http://localhost:8080/api/Device/ %User% / %Device%

Exemple 1 : http://localhost:8080/api/DeviceWithCompany/admin/

Exemple 2 : http://localhost:8080/api/DeviceWithCompany/admin/S20 Ultra

Exemple 3 : http://localhost:8080/api/DeviceWithCompany/user1/

Exemple 4 : http://localhost:8080/api/Device/user1/

Exemple 5 : http://localhost:8080/api/Device/user1/iPhone 13
