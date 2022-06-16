/*  ##################### FrontEnd Part #################
    Titel : UI With Bootstrap and jQuery
    Author : Feggaa Laid
    Date : 16/06/2022

    To : MIHTAB GENERAL TRADING

    note : See the results in the console
*/
$(document).ready(function(){
    let VersionCunter = 0

    $("#phCompany").empty()
    function GetColumn(iTable,index,sub) {
        return iTable.rows[index].cells[sub].childNodes[0].innerHTML
    }

     
    $("#PhonesSave").click(()=>{
        $("#phones").modal('hide');
        var PhonesList = []
        var table = document.getElementById("PhonesBody");

        for (var i = 0; i < (table.rows.length); i++) {
            PhonesList.push({Company : GetColumn(table,i,0),
                            Model : GetColumn(table,i,1),
                            Released : GetColumn(table,i,2),
                            Colors : GetColumn(table,i,3),
                            isHidden : GetColumn(table,i,4),
                            versions : GetColumn(table,i,5)})
        }

        $.ajax({
            url: 'api/Devices',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(PhonesList),
            success: function(response){
                alert(response);
                console.log('Recv',response)
            }})
    })
    
    $("#saveCopmanies").click(()=>{
        $("#company").modal('hide');
        var CompanyList = []
        var table = document.getElementById("CompnyBody");

        console.log(table.rows.length)
        for (var i = 0; i < (table.rows.length); i++) {
            var oID = GetColumn(table,i,0).replaceAll(" ","-")+"ID"
            CompanyList.push({  _id : oID,
                                Name : GetColumn(table,i,0),
                                Contry : GetColumn(table,i,1),
                                Logo : GetColumn(table,i,2)})
        }

        $.ajax({
            url: 'api/Companies',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(CompanyList),
            success: function(response){
                alert(response);
                console.log('Recv',response)
            }})
    })

    $("#ShowAddPhones").click(()=>{
        $("#phCompany").empty() // Companies List

        $.get("http://localhost:8080/xapi/Companies", function(zData, status){
                zData.forEach(element => {
                    var newComp = new Option(element.Name, element._id);
                    $(newComp).html(element.Name);
                    $("#phCompany").append(newComp);
                });

            });

        $("#divVersion").empty() // Device Model Versions
        $("#PhonesBody").empty() // Device table
        VersionCunter = 0
        $("#phones").modal('show'); // Show add Devices Form
    })
    $("#ShowAddCompanies").click(()=>{
        $("#compName").val("")
        $("#compConutry").val("")
        $("#compLogoUrl").val("")
        $("#CompnyBody").empty()     // companies table
        $("#company").modal('show'); // Show add companies Form
    })

    $("#addVersion").click(()=>{
        // Add Version
        $("#divVersion").append(`<div class="d-lg-flex align-items-lg-center" style="width: 100%;">
                                <h6 style="margin-top: 5px;">version : </h6><input id="version-${VersionCunter}" type="text" style="margin-right: 20px;" />
                                <h6 style="margin-top: 5px;">Destined : </h6><select id="destined-${VersionCunter}" style="margin-top: 5px;">
                                    <optgroup label="This is a group">
                                        <option selected>Asia</option>
                                        <option >china</option>
                                        <option >UAE</option>
                                        <option >USA</option>
                                    </optgroup>
                                </select>
                            </div>`)
            VersionCunter++;
            })

    $("#AddPhone").click(()=>{
        var phoneModel   =  $("#phModel").val()
        var phoneDate    =  $("#phDate").val()
        var phoneCompany =  $("#phCompany option:selected").val();
        var colores      = [{color : "Prism White",exist : false},
                                        {color : "Prism Black",exist : false},
                                        {color : "Prism Green",exist : false},
                                        {color : "Prism Blue",exist : false},
                                        {color : "Canary Yellow",exist : false}]

        var Permission = false
        var Version     = []

        /* set colores */
        for (let i = 0; i < 6; i++)
            if($("#Check-Color-"+i).is(':checked')) colores[i].exist = true

        /* set Permission */
        if($("#isHidden").is(':checked')) Permission = true

        /* Load version List */
        for (let i = 0; i < VersionCunter; i++){
            var phoneVersion    =  $("#version-"+i).val();
            var destined        =  $("#destined-"+i+" option:selected").text();
            if(destined === "") continue
            Version.push({Version : phoneVersion,Destined: destined})
        }
        
        // add new device to table
        $("#PhonesBody").append(`<tr><td ><div style="height: 30px; overflow:hidden;">${phoneCompany}</div></td>
                                 <td><div style="height: 30px; overflow:hidden;">${phoneModel}</div></td>
                                 <td><div style="height: 30px; overflow:hidden;">${phoneDate}</div></td>
                                 <td><div style="height: 30px; overflow:hidden;">${JSON.stringify(colores)}</div></td>
                                 <td><div style="height: 30px; overflow:hidden;">${Permission}</div></td>
                                 <td><div style="height: 30px; overflow:hidden;">${JSON.stringify(Version)}</div></td></tr>`)
        $("#divVersion").empty()
        $("#phModel").val("")
        $("#phDate").val("")
    })

    $("#addCompany").click(()=>{
        var compName    =  $("#compName").val()
        var compConutry    =  $("#compConutry").val()
        var compLogoUrl         =  $("#compLogoUrl").val()

        var table = document.getElementById("CompnyBody");

        
        /* check duplicate company */
        for (var i = 0; i < (table.rows.length); i++) {
            if(GetColumn(table,i,0) == compName){
                alert("Duplicate company is not allowed")
                return
            }
        }
        // add new company to table
        $("#CompnyBody").append(`<tr>
        <td><div style="height: 30px; overflow:hidden;">${compName}</div></td>
        <td><div style="height: 30px; overflow:hidden;">${compConutry}</div></td>
        <td><div style="height: 30px; overflow:hidden;">${compLogoUrl}</div></td></tr>`)
    })
        

    $("#GetDevicesOnly").click(()=>{
        GetDataFromServer("Device")
    })
    $("#GetDevicesWithCompny").click(()=>{
        alert('With company')
        GetDataFromServer("DeviceWithCompany")
    })

    function GetDataFromServer(mode) {
        var User      = $("#setUserID option:selected").text();
        var SearchDev = $("#SearchDev").val()
        var EndPoint = 'http://localhost:8080/api/DeviceWithCompany/'+User+'/'+SearchDev;

        $.get(EndPoint, function(gData, status){
            console.log(gData)
            $("#JsonReponse").text(JSON.stringify(gData))
        });
    }
});

