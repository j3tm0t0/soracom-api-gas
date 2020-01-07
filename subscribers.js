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
  
  var count=0;
  var last_evaluated_key=undefined;
  var subscribers=[];
  while(true)
  {
    count++;
    sheet.getRange(count+1,1).setValue("データ取得中: "+count+" 回目" + last_evaluated_key);
    
    const params={
      method: 'GET',
      contentType: "application/json",
      headers: {
        "Accept":"application/json",
        "X-Soracom-API-Key": authInfo.apiKey,
        "X-Soracom-Token": authInfo.token
      }
    };
  
    var url = baseUrl+"/v1/subscribers?limit="+limit;
    if(last_evaluated_key)
    {
      url+="&last_evaluated_key="+last_evaluated_key;
    }
    var response = UrlFetchApp.fetch(url,params);
    var data = JSON.parse(response.getContentText());
    subscribers = subscribers.concat(data);
    
    sheet.getRange(count+1,2).setValue("fetched "+subscribers.length+" data.");
    
    header=response.getHeaders();
    Logger.log(header);
    if(header.Link)
    {
      if(header.Link.match(/rel=prev/))
      {
        break;
      }
      header.Link.match(/last_evaluated_key=(\w+)/);
      last_evaluated_key=RegExp.$1;
    }
    else
    {
      break;
    }
  }
//  Logger.log(subscribers);
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
