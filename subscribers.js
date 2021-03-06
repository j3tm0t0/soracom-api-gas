function listSubscribers() {
  var limit=100;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("subscribers");
  sheet.clear();
  sheet.getRange(1,1).setValue("認証中");

  const baseUrl = getEndpointUrl();
  const authInfo=auth();
  if(authInfo==false)
  {
    return;
  }
  
  subscribers = fetchPagedData(authInfo, baseUrl, "/v1/subscribers", limit);

  for(var i=0; i<subscribers.length;i++)
  {
    s=subscribers[i];
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
  renderResult(sheet, subscribers);
}
