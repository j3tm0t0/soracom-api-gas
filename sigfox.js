function listSigfoxDevices() {
  var limit=100;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("sigfoxDevices");
  sheet.clear();
  sheet.getRange(1,1).setValue("認証中");

  const baseUrl = getEndpointUrl();
  const authInfo=auth();
  if(authInfo==false)
  {
    return;
  }
  
  sigfox_devices = fetchPagedData(authInfo, baseUrl, "/v1/sigfox_devices", limit);

  for(var i=0; i<sigfox_devices.length;i++)
  {
    s=sigfox_devices[i];
    if(s.tags)
    {
      s['name'] = s.tags.name;
      tagNames = Object.keys(s.tags);
      for(var j=0; j<tagNames.length ; j++)
      {
        s["tags."+tagNames[j]]=s.tags[tagNames[j]];
      }
    }
  }
  renderResult(sheet, sigfox_devices);
}
