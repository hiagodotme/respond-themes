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

  },

  /**
   * Submits a form
   *
   */
  submitForm: function(e) {

    e.preventDefault();

    var form, api, groups, siteId, submission, label, id, type, required, x, hasError = false;

    // get reference to form
    form = e.target;

    // get api
    api = form.getAttribute('action');
    siteId = form.getAttribute('data-site');

		// select all inputs in the local DOM
		groups = form.querySelectorAll('.form-group');

		// create submission
		submission = {
			url: window.location.href,
			siteId: siteId,
			formId: this.id,
			fields: []
		};

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

			submission.fields.push(
			  {
				  id: id,
				  value: value
			  }
			);

			// check required fields
			if(required == 'true' && value == ''){
				groups[x].className += ' has-error';
				hasError = true;
			}

		}

		// exit if error
		if(hasError == true) {
		  form.querySelector('.error').setAttribute('visible', '');
			return false;
		}

		// set loading
		form.querySelector('.loading').setAttribute('visible', '');

		// set context
		var context = this;

		// submit form
		var xhr = new XMLHttpRequest();

		// set URI
		var uri = api + '/submissions/add';

		xhr.open('POST', encodeURI(uri));

		// handle success
		xhr.onload = function() {
		    if(xhr.status === 200){

		    	// clear form, hide loading
          form.querySelector('.loading').removeAttribute('visible');
          form.querySelector('.error').removeAttribute('visible');
          form.querySelector('.success').setAttribute('visible', '');

		    	// clear the form
		    	respond.plugins.clearForm(form);
		    }
		    else if(xhr.status !== 200){

		      // show error
		    	form.querySelector('.loading').removeAttribute('visible');
          form.querySelector('.error').setAttribute('visible', '');

		      console.log('[respond.error] respond-form component: failed post, xhr.status='+xhr.status);
		    }
		};

		// send serialized data
		xhr.send(JSON.stringify(submission));

		return false;
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

