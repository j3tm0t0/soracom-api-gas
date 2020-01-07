function onOpen() {
  var ui = SpreadsheetApp.getUi();
  Logger.log(Session.getActiveUser());
  ui.createMenu('SORACOM')
  .addItem('listSubscribrs', 'listSubscribers')
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
