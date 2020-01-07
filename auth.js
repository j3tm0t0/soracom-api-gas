function auth() {
  const config = readConfig();
  if(config.authKeyId=="changeme")
  {
    Browser.msgBox("config シートの authKeyId / authKey を編集する必要があります");
    return false;
  }
  
  const payload = {
    authKeyId: config.authKeyId,
    authKey: config.authKey
  };
  
  const params={
    method: 'POST',
    contentType: "application/json",
    headers: { "Accept":"application/json" },
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch("https://api.soracom.io/v1/auth",params);
  Logger.log(response.getContentText());
  return JSON.parse(response.getContentText());
}
