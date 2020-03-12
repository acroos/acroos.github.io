document.getElementById('console-line').onblur = function (event) { 
  var blurEl = this; 
  setTimeout(function() {
    blurEl.focus()
  }, 10);
};

document.getElementById('console-line').addEventListener("keyup", function(event) {
  if (event.keyCode != 13) {
    return;
  }
  document.getElementById('email-link').click();
});

document.getElementById('email-link').onclick = function(event) {
  var emailAddress = "roos.austin@gmail.com"
  var subjectText = "Hi Austin!"
  var bodyText = document.getElementById('console-line').value;
  var query = encodeURI(`subject=${subjectText}&body=${bodyText}`)

  var uri = `mailto:${emailAddress}?${query}`

  window.open(uri, '_blank');
};
