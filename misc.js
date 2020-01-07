function onOpen() {
  var ui = SpreadsheetApp.getUi();
  Logger.log(Session.getActiveUser());
  ui.createMenu('SORACOM')
  .addItem('listSubscribrs', 'listSubscribers')
  .addItem('listSigfoxDevices', 'listSigfoxDevices')
  .addToUi();
}

function readConfig()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("config");
  var i=1;
  var config={};
  while(true)
  {
    if(sheet.getRange(i,1).getValue())
    {
      config[sheet.getRange(i,1).getValue()]=sheet.getRange(i,2).getValue();
      i++;
    }
    else
    {
      break;
    }
  }
  Logger.log(config);
  return config;
}

function getEndpointUrl(coverageType){
  const config = readConfig();
  if(config.coverageType)
  {
    if(config.coverageType == "g")
    {
      return "https://g.api.soracom.io";
    }
  }
  return "https://api.soracom.io";
}

function fetchPagedData(authInfo, baseUrl, path, limit){
  var count=0;
  var last_evaluated_key=undefined;
  var output=[];
  while(true)
  {
    count++;    
    const params={
      method: 'GET',
      contentType: "application/json",
      headers: {
        "Accept":"application/json",
        "X-Soracom-API-Key": authInfo.apiKey,
        "X-Soracom-Token": authInfo.token
      }
    };
  
    var url = baseUrl+path+"?limit="+limit;
    if(last_evaluated_key)
    {
      url+="&last_evaluated_key="+last_evaluated_key;
    }
    var response = UrlFetchApp.fetch(url,params);
    var data = JSON.parse(response.getContentText());
    output = output.concat(data);
    
    Logger.log("fetched "+data.length+" data.");
    
    header=response.getHeaders();
    Logger.log(header);
    if(header.Link)
    {
      if(header.Link.match(/rel=prev/) && !header.Link.match(/rel=next/))
      {
        break;
      }
      header.Link.match(/last_evaluated_key=(\w+).; rel=next/);
      last_evaluated_key=RegExp.$1;
    }
    else
    {
      break;
    }
  }
  return output;
}

function renderResult(sheet, data) {
  var tmp={};
  for(var i=0; i< data.length ; i++)
  {
    sheet.getRange(i+1,1).setValue(data[i].imsi);
    keys=Object.keys(data[i]);
    for(var j=0; j< keys.length ; j++)
    {
      tmp[keys[j]]=1;
    }
  }
  const columns = Object.keys(tmp);
  Logger.log(columns);
  
  sheet.clear();
  for(var j=0; j< columns.length; j++)
  {
    sheet.getRange(1,j+1).setValue(columns[j]);
  }
    
  for(var i=0; i< data.length ; i++)
  {
    for(var j=0; j< columns.length; j++)
    {
      if(data[i][columns[j]])
      {
        sheet.getRange(i+2,j+1).setValue(data[i][columns[j]]);
      }
    }
  }
}
