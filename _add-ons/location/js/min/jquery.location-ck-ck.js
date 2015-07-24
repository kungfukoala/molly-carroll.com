!function(t){"use strict";var a,e,o;a={starting_latitude:44.33,starting_longitude:-68.21,starting_zoom:15,allow_geolocation:!0,geolocation_zoom:17,use_foursquare:!1,foursquare_client_id:"",foursquare_client_secret:"",foursquare_radius:200,attribution:"",min_zoom:4,max_zoom:18,float_precision:4,common_locations:[],interaction:{scroll_wheel_zoom:!0,double_click_zoom:!0,box_zoom:!0,touch_zoom:!0,draggable:!0},cloudmade_api_key:"336304a90a064433aee8146c4d6668f5",cloudmade_tile_set_id:997,detect_retina:!0},e={map:{element:null,object:null},marker:{latitude:null,longitude:null,object:null},timeouts:{latitude:null,longitude:null},version_date:"20121226"},o={init:function(n){var i=t.extend({},a,n,e);return this.each(function(){var a=t(this);a.data("location",t.extend(!0,{},i));try{o.verify.apply(a),o.overrideConfiguration.apply(a),o.startMap.apply(a),o.createHelperLinks.apply(a),o.bindInputEvents.apply(a)}catch(e){alert("An error occurred trying to initialized the map.")}})},verify:function(){if(!t(this).is(".input-location"))throw"Cannot verify location input, not an .input-location element.";if(!t(this).children(".map").length)throw"Cannot verify location input, missing map.";return t.isArray(t(this).data("location").common_locations)||(t(this).data("location").common_locations=[]),!0},overrideConfiguration:function(){var a,e=t(this),o=e.data("location");a=e.find(".map").data("location-configuration"),a&&e.data("location",t.extend({},o,a))},startMap:function(){var a,e=_.uniqueId("map-"),n=t(this),i=n.data("location");a=""!==n.find(".latitude > input").val()&&""!==n.find(".longitude > input").val()?[parseFloat(n.find(".latitude > input").val()),parseFloat(n.find(".longitude > input").val())]:[i.starting_latitude,i.starting_longitude],i.map.element=n.children(".map").attr("id",e),i.map.object=L.map(e,{scrollWheelZoom:i.interaction.scroll_wheel_zoom,doubleClickZoom:i.interaction.double_click_zoom,boxZoom:i.interaction.box_zoom,touchZoom:i.interaction.touch_zoom,dragging:i.interaction.draggable}).setView(a,i.starting_zoom),L.tileLayer("http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png",{attribution:i.attribution,maxZoom:i.max_zoom,minZoom:i.min_zoom,key:i.cloudmade_api_key,styleId:i.cloudmade_tile_set_id,detectRetina:i.detect_retina}).addTo(i.map.object),o.bindMapEvents.apply(n),n.find(".latitude > input").val()&&n.find(".longitude > input").val()&&o.placeMarker.apply(n,[parseFloat(n.find(".latitude > input").val()),parseFloat(n.find(".longitude > input").val())])},createHelperLinks:function(){var a=t(this),e=a.data("location");a.find(".helpers").length||(a.find(".entry").append('<div class="helpers"><section><label>Helpful Map Tools</label><ul></ul></section></div>'),e.common_locations.length&&t("#location-selector").length&&a.find(".helpers ul").append('<li class="common-locations"><a href="#">Common Places</a></li>'),a.find(".helpers ul").append('<li class="locate-address"><a href="#">Locate an Address</a></li>'),e.allow_geolocation&&o.supportsGeolocation.apply(a)&&a.find(".helpers ul").append('<li class="use-my-location"><a href="#">Use My Location</a><span></span></li>'),a.find(".helpers").append("<section><label>Reset</label><ul></ul></section>"),a.find(".helpers ul").eq(1).append('<li class="remove-marker"><a href="#">Remove Marker</a></li>'),e.marker.object||o.disableHelperLink.apply(a,["remove-marker"]),a.find(".helpers .common-locations a").on("click",function(){return o.showCommonPlaces.apply(a),!1}).end().find(".helpers .remove-marker a").on("click",function(){return o.removeMarker.apply(a),!1}).end().find(".helpers .locate-address a").on("click",function(){return o.showAddressLookup.apply(a),!1}).end().find(".helpers .use-my-location a").on("click",function(){return o.findMe.apply(a),!1}))},bindInputEvents:function(){var a=t(this);a.find(".latitude > input, .longitude > input").on("keyup",function(){o.attemptPlaceMarker.apply(a,[])})},enableHelperLink:function(a){t(this).find("."+a+" a").removeClass("disabled")},disableHelperLink:function(a){t(this).find("."+a+" a").addClass("disabled")},supportsGeolocation:function(){return"geolocation"in navigator},fillForm:function(a){var e=a.zoom||null,n=t(this);a.name&&n.find(".name input").val(a.name),a.latitude&&n.find(".latitude > input").val(a.latitude),a.longitude&&n.find(".longitude > input").val(a.longitude),o.attemptPlaceMarker.apply(n,[e])},standardizeCoordinate:function(t){return _.isNumber(t)&&!isNaN(t)?t:_.isString(t)?parseFloat(t):0},findMe:function(){var a=t(this),e=a.data("location"),n=a.find(".use-my-location span");return o.supportsGeolocation.apply(a)?(n.spin(),void navigator.geolocation.getCurrentPosition(function(t){var i=t.coords.latitude.toFixed(e.float_precision),l=t.coords.longitude.toFixed(e.float_precision);try{o.getNearestFoursquareVenue.apply(a,[i,l])}catch(r){o.placeMarker.apply(a,[i,l,!0,e.geolocation_zoom])}n.spin(!1)},function(t){switch(t.code){case 1:alert("We can’t find you, you wouldn’t let us.");break;case 2:alert("We can’t find you, the network isn’t available.");break;case 3:alert("We can’t find you, the network is taking too long.")}})):!1},getNearestFoursquareVenue:function(a,e){var n=t(this),i=n.data("location");if(!i.foursquare_client_id||!i.foursquare_client_secret)throw"Missing Foursquare credentials.";t.getJSON("https://api.foursquare.com/v2/venues/search",{ll:a+","+e,client_id:i.foursquare_client_id,client_secret:i.foursquare_client_secret,radius:i.foursquare_radius,v:i.version_date},function(t){200===t.meta.code&&t.response.venues.length&&t.response.venues[0].name&&n.find(".name input").val(t.response.venues[0].name),o.placeMarker.apply(n,[a,e,!0,i.geolocation_zoom])})},showCommonPlaces:function(){var a=t(this),e=a.data("location");t("#modal-placement").length||t("#wrap").after('<div id="modal-placement"></div>'),t("#location-modal .modal-body ul li").length||t.each(e.common_locations,function(){t("#location-modal .modal-body ul").append('<li><a href="#" data-name="'+this.name+'" data-latitude="'+this.latitude+'" data-longitude="'+this.longitude+'" data-zoom="'+this.zoom+'">'+this.name+"</a></li>")}),t("#modal-placement").unbind(".location").on("click.location",".modal-body ul a",function(){return o.fillForm.apply(a,[{name:t(this).data("name"),latitude:t(this).data("latitude"),longitude:t(this).data("longitude"),zoom:t(this).data("zoom")}]),t("#location-modal").modal("hide"),!1}).html(t("#location-selector").html()),t("#location-modal").modal()},showAddressLookup:function(){var a=t(this),e=a.data("location");t("#modal-placement").length||t("#wrap").after('<div id="modal-placement"></div>'),t("#modal-placement").unbind(".location").on("submit.location","form",function(){var n=t(this).find("input#modal-address-field").val();return t.getJSON("http://open.mapquestapi.com/geocoding/v1/address?callback=?",{location:n,maxResults:1,thumbMaps:!1},function(n){n.results.length&&n.results[0].locations.length?(o.fillForm.apply(a,[{name:n.results[0].providedLocation.location,latitude:n.results[0].locations[0].latLng.lat.toFixed(e.float_precision),longitude:n.results[0].locations[0].latLng.lng.toFixed(e.float_precision)}]),t("#address-modal").modal("hide")):t("#modal-placement form small").animate({opacity:0},150,function(){t(this).css("color","#BF1D2D").text("Sorry, we could not find that address.").animate({opacity:1},150)})}),!1}).html(t("#address-lookup").html()),t("#address-modal").modal()},attemptPlaceMarker:function(){var a,e,n=arguments[0]||null,i=t(this);a=parseFloat(i.find(".latitude > input").val()),e=parseFloat(i.find(".longitude > input").val()),!isNaN(a)&&!isNaN(e)&&o.placeMarker.apply(i,[a,e,!0,n])},placeMarker:function(a,e){var n=arguments[2],i=arguments[3],l=t(this),r=l.data("location"),d=!!r.marker.object;a=o.standardizeCoordinate.apply(l,[a]),e=o.standardizeCoordinate.apply(l,[e]),l.find(".latitude > input").val().match(/^\d+\.[0]*$/)||l.find(".latitude > input").val(a),l.find(".longitude > input").val().match(/^\d+\.[0]*$/)||l.find(".longitude > input").val(e),d?r.marker.object.setLatLng(new L.LatLng(a,e)):(r.marker.object=L.marker([a,e],{draggable:!0}).addTo(r.map.object),o.enableHelperLink.apply(l,["remove-marker"]),o.bindMarkerEvents.apply(l)),n&&a&&e&&o.recenterMap.apply(l,[a,e,i])},recenterMap:function(a,e){var o=new L.LatLng(parseFloat(a),parseFloat(e)),n=t(this),i=n.data("location"),l=arguments[2]||i.starting_zoom;i.map.object.panTo(o).setZoom(l)},removeMarker:function(){var a=t(this),e=a.data("location");e.marker.object&&(o.disableHelperLink.apply(a,["remove-marker"]),e.map.object.removeLayer(e.marker.object),e.marker.object=null,a.find(".latitude > input, .longitude > input").val(""))},bindMapEvents:function(){var a=t(this),e=a.data("location");e.map.object.on("click",function(t){e.marker.object||o.placeMarker.apply(a,[t.latlng.lat.toFixed(e.float_precision),t.latlng.lng.toFixed(e.float_precision)])})},bindMarkerEvents:function(){var a=t(this),e=a.data("location");e.marker.object.on("drag",function(t){var n=t.target._latlng.lat.toFixed(e.float_precision),i=t.target._latlng.lng.toFixed(e.float_precision);o.placeMarker.apply(a,[n,i])}),e.marker.object.on("dragend",function(t){var n=t.target._latlng.lat.toFixed(e.float_precision),i=t.target._latlng.lng.toFixed(e.float_precision);o.placeMarker.apply(a,[n,i])})}},t.fn.location=function(a){return o[a]?o[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"==typeof o||t.isFunction(a)||!a?o.init.apply(this,arguments):void t.error("Method "+a+" does not exist for jQuery.location")}}(jQuery);