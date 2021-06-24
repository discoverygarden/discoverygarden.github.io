/**
 * Calls the appropriate form function.
 *
 * Calls the appropriate form function based on
 * JSON response.
 *
 * @param json
 *   The json response.
 */
function logResult(json) {
  if(json.result === "success"){
    formSuccess();
  } else if(json.result === "error") {
    formError();
  }
}

/**
 * Ajax call for pardot to work in webflow.
 *
 * Adapted from
 * https://forum.webflow.com/t/success-error-messages-and-pardot-form-handlers-with-webflow/92580.
 */
makeWebflowFormAjax = function(forms, successCallback, errorCallback) {
  forms.each(function() {
    var form = $(this);
    form.on("submit", function() {
      var container =   form.parent();
      var doneBlock =  $(".w-form-done", container);
      var failBlock =  $(".w-form-fail", container);

      var action  = form.attr("action");
      var method  = form.attr("method");
      var data    = form.serialize();
      var dataURI = {};


      form.find("input, textarea, select").each(function() {
        var inputType = this.tagName.toUpperCase() === "INPUT" && this.type.toUpperCase();
        if (inputType !== "BUTTON" && inputType !== "SUBMIT") {
          dataURI[this.name] = $(this).val();
        }
      });

      dataURI = $.param(dataURI);

      formSuccess = function() {
        form.hide();
        doneBlock.fadeIn();
        failBlock.hide();
      }
      formError = function() {
        form.show();
        doneBlock.hide();
        failBlock.fadeIn();
      }

      $.ajax({
        type: method,
        url: action + '?' + dataURI,
        dataType: "jsonp",
        jsonpCallback: 'logResult'
      });

      // Prevent default webflow action.
      return false;
    });
  });
}
