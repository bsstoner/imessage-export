var iMessage = require('imessage'),
    fs = require('fs'),

    im = new iMessage(),

    phone = '+18005555555',
    outputFile = 'messages.json';

im.getRecipients(function(err, recipients) {
  if (err) { throw new Error(err); }
  if (!recipients || !recipients.length) { throw new Error("No Recipients Found!"); }

  var rowId;

  for (var i=0; i<recipients.length; i++) {
    var recip = recipients[i];
    if (recip.id.indexOf(phone) > -1) {
      rowId = recip.ROWID;
      break;
    }
  }

  if (!rowId) { throw new Error("Phone: " + phone + " not found in your iMessage Recipients"); }

  im.getMessagesFromId(rowId, function(err,data) {
    if (err) { throw new Error(err); }
    if (!data || !data.length) { throw new Error("No messages found for that Recipient"); }

    var messages = data.map(function(msg) {
      return {
        text: msg.text,
        fromMe: msg.is_from_me,
        date: new Date((msg.date + iMessage.OSX_EPOCH) * 1000).toString()
      }
    });

    fs.writeFile(outputFile, JSON.stringify(messages,null,4), function(err,ok) {
      if (err) { throw new Error(err); }

      console.log("Done --> Output written to: " + outputFile);

      process.exit();
    });
  });
});
