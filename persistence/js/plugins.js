var respond = respond || {};

/**
 * Handles plugins functionality for Respond
 *
 */
respond.plugins = {

	init:function(){

    var forms, x;

    // setup [respond-form]
    forms = document.querySelectorAll('[respond-form]');

    // setup submit event for form
    for(x=0; x<forms.length; x++) {
      forms[x].addEventListener('submit', respond.plugins.submitForm);
    }

    // setup maps
    maps = document.querySelectorAll('[type=map]');

    // setup submit event for form
    for(x=0; x<maps.length; x++) {
      respond.plugins.setupMap(maps[x]);
    }
    
    // generic success toast
    if(window.location.hash) {
      var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      
      if(hash === 'success') {
        toast.show('success');
      }
    }

  },  

  /**
   * checks for errors prior to submitting the form
   *
   */
  submitForm: function(e) {

    var form, groups, submission, label, id, type, required, x, hasError = false;

    // get reference to form
    form = e.target;

		// select all inputs in the local DOM
		groups = form.querySelectorAll('.form-group');

		// walk through inputs
		for(x=0; x<groups.length; x++) {

			// get name, id, type
			label = groups[x].getAttribute('data-label');
			id = groups[x].getAttribute('data-id');
			type = groups[x].getAttribute('data-type');
			required = groups[x].getAttribute('data-required');

			// get value by type
			var value = '';

			if(type == 'text'){
				value = groups[x].querySelector('input').value;
			}
			else if(type == 'textarea'){
				value = groups[x].querySelector('textarea').value;
			}
			else if(type == 'radiolist'){
				var radio = groups[x].querySelector('input[type=radio]:checked');

				if(radio != null){
					value = radio.value;
				}
			}
			else if(type == 'select'){
				value = groups[x].querySelector('select').value;
			}
			else if(type == 'checkboxlist'){
				var checkboxes = groups[x].querySelectorAll('input[type=checkbox]:checked');

				// create comma separated list
				for(y=0; y<checkboxes.length; y++){
					value += checkboxes[y].value + ', ';
				}

				// remove trailing comma and space
				if(value != ''){
					value = value.slice(0, -2);
				}
			}
			
			// check required fields
			if(required == 'true' && value == ''){
				groups[x].className += ' has-error';
				hasError = true;
			}

		}

		// exit if error
		if(hasError == true) {
		  form.querySelector('.error').setAttribute('visible', '');
		  
		  // stop processing
		  e.preventDefault();
			return false;
		}

		// set loading
		form.querySelector('.loading').setAttribute('visible', '');
		
		return true;
		
  },

  /**
   * clears the form a form
   *
   */
	clearForm:function(form) {

	  var els, x;

	  // remove .has-error
		els = form.querySelectorAll('.has-error');

		for(x=0; x<els.length; x++){
			els[x].classList.remove('has-error');
		}

		// clear text fields
		els = form.querySelectorAll('input[type=text]');

		for(x=0; x<els.length; x++){
			els[x].value = '';
		}

		// clear text areas
		els = form.querySelectorAll('textarea');

		for(x=0; x<els.length; x++){
			els[x].value = '';
		}

		// clear checkboxes
		els = form.querySelectorAll('input[type=checkbox]');

		for(x=0; x<els.length; x++){
			els[x].checked = false;
		}

		// clear radios
		els = form.querySelectorAll('input[type=radio]');

		for(x=0; x<els.length; x++){
			els[x].checked = false;
		}

		// reset selects
		els = form.querySelectorAll('select');

		for(x=0; x<els.length; x++){
			els[x].selectedIndex = 0;
		}

	},

	/**
   * Setups a map
   *
   */
  setupMap: function(el) {

    var container, zoom, defaultZoom, mapOptions, map;

    // get container, address and zoom
    container = el.querySelector('.map-container');
    address = el.getAttribute('address');
    zoom = el.getAttribute('zoom');

    // set zoom
    defaultZoom = 8;

    if (zoom != 'auto' && zoom != undefined) {
      defaultZoom = parseInt(zoom);
    }

    // create the map
    var mapOptions = {
      center: new google.maps.LatLng(38.6272, -90.1978),
      zoom: defaultZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // create map and bounds
    map = new google.maps.Map(container, mapOptions);

    // set location
    respond.plugins.setLocation(map, address);

  },

  /**
   * Sets the location on the map (this.map) to the current address (this.address)
   */
  setLocation: function(map, address) {

    var latitude, longitude, content, infowindow, marketext, marker, coords;

    // look for a default address
    if (address != null && address != undefined) {

      // geo-code the address
      var geocoder = new google.maps.Geocoder();

      var context = this;

      geocoder.geocode({
        'address': address
      }, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
          content = results[0].formatted_address;

          coords = new google.maps.LatLng(latitude, longitude);

          infowindow = new google.maps.InfoWindow({
            content: content
          });

          // create marker
          marktext = '<div>' + content + '</div>';

          marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: marktext
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
          });


          map.setCenter(coords);

        }

      });

    }

  }

};

// fire init
document.addEventListener("DOMContentLoaded", function(event) {
  respond.plugins.init();
});


/*
 * Shows a toast
 * Usage: toast.show('success', 'Saved!');  toast.show('failure', 'Error!');
 */
var toast = toast || {};

toast = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the toast
     */
    setup: function() {

      var current;

      current = document.createElement('div');
      current.setAttribute('class', 'app-toast');
      current.innerHTML = 'Sample Toast';

      // append toast
      document.body.appendChild(current);

      return current;

    },

    /**
     * Shows the toast
     */
    show: function(status, text) {

      var current;

      current = document.querySelector('.app-toast');

      if(current == null) {
        current = toast.setup();
      }

      current.removeAttribute('success');
      current.removeAttribute('failure');

      current.setAttribute('active', '');

      // add success/failure
      if (status == 'success') {
        current.setAttribute('success', '');

        if(text == '' || text == undefined || text == null) {

          text = '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">' +
                  '<path d="M0 0h24v24H0z" fill="none"/>' +
                  '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>' +
                  '</svg>';

        }


      }
      else if (status == 'failure') {
        current.setAttribute('failure', '');

        if(text == '' || text == undefined || text == null) {

          text = '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">' +
                 '<path d="M0 0h24v24H0V0z" fill="none"/>' +
                 '<path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>' +
                 '</svg>';

        }
      }

      // set text
      current.innerHTML = text;

      // hide toast
      setTimeout(function() {
        current.removeAttribute('active');
      }, 1000);

    }

  }

})();

toast.setup();

