/**
 * [balzdash]
 *
 * @version: 0.0.1
 * @author: [author]
 * @description [description]
 *
 * [license]
 */


/**
 * Custom Application
 */

CustomApplicationsHandler.register("app.balzdash", new CustomApplication({

	/**
	 * (require)
	 *
	 * An object array that defines resources to be loaded such as javascript's, css's, images, etc
	 *
	 * All resources are relative to the applications root path
	 */

	require: {

		/**
		 * (js) defines javascript includes
		 */

		js: [],

		/**
		 * (css) defines css includes
		 */

		css: ['app.css'],

		/**
		 * (images) defines images that are being preloaded
		 *
		 * Images are assigned to an id, e.g. {coolBackground: 'images/cool-background.png'}
		 */

		images: {

		},
	},

	/**
	 * (settings)
	 *
	 * An object that defines application settings
	 */

	settings: {

		/**
		 * (title) The title of the application in the Application menu
		 */

		title: 'Info',

		/**
		 * (statusbar) Defines if the statusbar should be shown
		 */

		statusbar: false,

		/**
		 * (statusbarIcon) defines the status bar icon
		 *
		 * Set to true to display the default icon app.png or set a string to display
		 * a fully custom icon.
		 *
		 * Icons need to be 37x37
		 */

		statusbarIcon: false,

		/**
		 * (statusbarTitle) overrides the statusbar title, otherwise title is used
		 */

		statusbarTitle: false,

		/**
		 * (statusbarHideHomeButton) hides the home button in the statusbar
		 */

		// statusbarHideHomeButton: false,

		/**
		 * (hasLeftButton) indicates if the UI left button / return button should be shown
		 */

		hasLeftButton: false,

		/**
		 * (hasMenuCaret) indicates if the menu item should be displayed with an caret
		 */

		hasMenuCaret: false,

		/**
		 * (hasRightArc) indicates if the standard right arc should be displayed
		 */

		hasRightArc: false,

	},


	/**
     * (regions)
     *
     * A object that allows us to manage the different regions
     */

    regions: {

        /**
         * North America (na)
         */

        na: {
        	speedUnit: 'MPH',
			speedTransform: DataTransform.toMPH,
			fuelConsUnit: 'AVG MPG',
			fuelConsTransform: DataTransform.toMPG,
        	temperatureUnit: 'f',
			temperatureTransform: DataTransform.toFahrenheit,
        },

        /**
         * Europe (eu)
         */

        eu: {
			speedUnit: 'KM/H',
			speedTransform: false,
			fuelConsUnit: 'AVG L/100km',
			fuelConsTransform: false,
        	temperatureUnit: 'c',
			temperatureTransform: false,
        },
    },


	/***
	 *** Application Life Cycles
	 ***/

	/**
	 * (created)
	 *
	 * Executed when the application is initialized for the first time. Once an application is
	 * initialized it always keeps it's current state even the application is not displayed.
	 *
	 * Usually you want to initialize your user interface here and generate all required DOM Elements.
	 *
	 *
	 * @event
	 * @return {void}
	 */

	created: function() {
		var self = this;

		this.topLeftCon = $("<div/>").attr('id', 'top-left-con');
		this.topRightCon = $("<div/>").attr('id', 'top-right-con');
		this.bottomRightCon = $("<div/>").attr('id', 'bottom-right-con');
		this.bottomCon = $("<div/>").attr('id', 'bottom-con');

		this.speedometer = $("<div/>").attr('id', 'speedometer').appendTo(this.topLeftCon);
		this.speedometerValue = $("<div/>").addClass('value').html('0').appendTo(this.speedometer);
		this.speedometerLabel = $("<label/>").addClass('label').appendTo(this.speedometer);


		this.timeCon = $("<div/>").attr('id', 'time-con').appendTo(this.topRightCon);
		this.dateCon = $("<div/>").attr('id', 'date-con').appendTo(this.topRightCon);

		this.temperature = $("<div/>").attr('id', 'temperature').appendTo(this.topRightCon);
		this.temperatureValue = $("<div/>").addClass('value').html('0').appendTo(this.temperature);
		this.temperatureLabel = $("<label/>").addClass('label').appendTo(this.temperature);

		this.heading = $('<div/>').attr('id', 'heading').appendTo(this.topRightCon);
		this.headingLabel = $("<label/>").addClass('label').appendTo(this.heading);
		this.headingValue = $("<div/>").addClass('value').html('N').appendTo(this.heading);

		this.avgFuelCons = $('<div/>').attr('id', 'avg-fuel-cons').appendTo(this.topRightCon);
		this.avgFuelConsLabel = $("<label/>").addClass('label').appendTo(this.avgFuelCons);
		this.avgFuelConsValue = $("<div/>").addClass('value').html('0').appendTo(this.avgFuelCons);

		this.fuelLevel = $('<div/>').addClass('fuel-level').appendTo(this.bottomCon);
		this.fuelPercentage = $('<div/>').addClass('fuel-percentage').appendTo(this.bottomCon);
		this.fuelIcon = $('<div/>').addClass('fuel-icon').appendTo(this.bottomCon);


		this.topLeftCon.appendTo(this.canvas);
		this.topRightCon.appendTo(this.canvas);
		this.bottomRightCon.appendTo(this.canvas);
		this.bottomCon.appendTo(this.canvas);


		this.createSections();

		this.updateSection(0);
		this.updateSection(2);
		this.updateSection(5);
		this.updateSection(6);


		// this.updateDateTime();
		// this.updateDateTimeTimer = setInterval(function() { self.updateDateTime(); }, 10000);
	},

	/**
	 * (focused)
	 *
	 * Executes when the application gets displayed on the Infotainment display.
	 *
	 * You normally want to start your application workflow from here and also recover the app from any
	 * previous state.
	 *
	 * @event
	 * @return {void}
	 */

	focused: function() {

	},


	/**
	 * (lost)
	 *
	 * Lost is executed when the application is being hidden.
	 *
	 * Usually you want to add logic here that stops your application workflow and save any values that
	 * your application may require once the focus is regained.
	 *
	 * @event
	 * @return {void}
	 */

	lost: function() {

	},


	/**
	 * (terminated)
	 *
	 * Usually you never implement this lifecycle event. Your custom application stays alive and keeps it's
	 * state during the entire runtime of when you turn on your Infotainment until you turn it off.
	 *
	 * This has two advantages: First all of your resources (images, css, videos, etc) all need to be loaded only
	 * once and second while you wander through different applications like the audio player, your application
	 * never needs to be reinitialized and is just effectivily paused when it doesn't have the focus.
	 *
	 * However there are reasons, which I can't think any off, that your application might need to be
	 * terminated after each lost lifecyle. You need to add {terminateOnLost: true} to your application settings
	 * to enable this feature.
	 *
	 * @event
	 * @return {void}
	 */

	terminated: function() {
		// clearInterval(this.updateDateTimeTimer);
	},


	/***
	 *** Application Events
	 ***/


    /**
     * (event) onContextEvent
     *
     * Called when the context of an element was changed
     *
     * The eventId might be either FOCUSED or LOST. If FOCUSED, the element has received the
     * current context and if LOST, the element's context was removed.
     *
     * @event
     * @param {string} eventId - The eventId of this event
     * @param {object} context - The context of this element which defines the behavior and bounding box
     * @param {JQueryElement} element - The JQuery DOM node that was assigned to this context
     * @return {void}
     */

    onContextEvent: function(eventId, context, element) {

        switch(eventId) {

        	/**
        	 * The element received the focus of the current context
        	 */

        	case this.FOCUSED:

        		break;

        	/**
        	 * The element lost the focus
        	 */

        	case this.LOST:

        		break;
        }

    },


	/**
     * (event) onRegionChange
     *
     * Called when the region is changed
     */

     onRegionChange: function(region) {

        // let's just refresh our current section
		this.updateSection(0);
		this.updateSection(4);
		this.updateSection(5);

     },


	/**
	 * (event) onControllerEvent
	 *
	 * Called when a new (multi)controller event is available
	 *
	 * @event
	 * @param {string} eventId - The Multicontroller event id
	 * @return {void}
	 */

	onControllerEvent: function(eventId) {

		switch(eventId) {

			/*
			 * MultiController was moved to the left
			 */
			case this.LEFT:

				break;

			/*
			 * MultiController was moved to the right
			 */
			case this.RIGHT:

				break;

			/*
			 * MultiController was moved up
			 */
			case this.UP:

				break;

			/*
			 * MultiController was moved down
			 */
			case this.DOWN:

				break;

			/*
			 * MultiController Wheel was turned clockwise
			 */
			case this.CW:

				break;

			/*
			 * MultiController Wheel was turned counter-clockwise
			 */
			case this.CCW:

				break;

			/*
			 * MultiController's center was pushed down
			 */
			case this.SELECT:
				this.setRegion(this.getRegion() == "na" ? "eu" : "na");
				break;

			/*
			 * MultiController hot key "back" was pushed
			 */
			case this.BACK:

				break;
		}

	},


	transformHeading: function(heading) {
		var arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"],
			val = parseInt((heading/22.5)+0.5);

		return arr[(val % 16)];
	},


	updateDateTime: function(timestamp) {
		var objDate = new Date(timestamp*1000),
			locale = "en-us",
			month = objDate.toLocaleString(locale, { month: "short" }),
			dotw = objDate.toLocaleString(locale, { weekday: "short" }),
			d = objDate.getDate(),
			h = objDate.getHours(),
    		m = objDate.getMinutes(),
			ap = (h <= 11) ? 'AM' : 'PM';

		if (h === 0) {
			h = 12;
		} else if (h > 12) {
			h -= 12;
		}

		if (m < 10) {
			m = '0'+m;
		}

		this.dateCon.html(dotw+', '+month+' '+this.ordinal_suffix_of(d));
		this.timeCon.html(h+':'+m+'<span class="ampm">'+ap+'</span>');
	},


	/*
	* http://stackoverflow.com/a/13627586/867676
	*/
	ordinal_suffix_of: function(i) {
	    var j = i % 10,
	        k = i % 100;
	    if (j == 1 && k != 11) {
	        return i + "st";
	    }
	    if (j == 2 && k != 12) {
	        return i + "nd";
	    }
	    if (j == 3 && k != 13) {
	        return i + "rd";
	    }
	    return i + "th";
	},


	/**
     * (createSections)
     *
     * This method registers all the sections we want to display
     */

    createSections: function() {

        // Here we define our sections

        this.sections = [

            // Vehicle speed
            {field: VehicleData.vehicle.speed, transform: function(speed, index) {

                // For speed we need to transform it to the local region
                if (this.regions[this.getRegion()].speedTransform) {
                    speed = this.regions[this.getRegion()].speedTransform(speed);
                }

                // return the new value and name
                return {
                    value: speed,
                    name: this.regions[this.getRegion()].speedUnit
                };

            }.bind(this)},

            // Vehicle RPM
            {field: VehicleData.vehicle.rpm, name: 'RPM'},

            // GPS Heading
            {field: VehicleData.gps.heading, transform: function(heading, index) {

				heading	= this.transformHeading(heading);

                // return the new value and name
                return {
                    value: heading,
                    name: 'Heading'
                };

            }.bind(this)},

            // Fuel Level
            {field: VehicleData.fuel.position, name: 'Fuel Level'},

            // Average Consumption
            {field: VehicleData.fuel.averageconsumption, transform: function(fuelCons, index) {

                // For speed we need to transform it to the local region
                if (this.regions[this.getRegion()].fuelConsTransform) {
                    fuelCons = this.regions[this.getRegion()].fuelConsTransform(fuelCons);
                }

                // return the new value and name
                return {
                    value: fuelCons,
                    name: this.regions[this.getRegion()].fuelConsUnit
                };

            }.bind(this)},

            // Temperature: Outside
            {field: VehicleData.temperature.outside, transform: function(temperature, index) {

                // For speed we need to transform it to the local region
                if (this.regions[this.getRegion()].temperatureTransform) {
                    temperature = this.regions[this.getRegion()].temperatureTransform(temperature);
                }

                // return the new value and name
                return {
                    value: temperature,
                    name: this.regions[this.getRegion()].temperatureUnit
                };

            }.bind(this)},

			// GPS Timestamp
            {field: VehicleData.gps.timestamp, name: 'GPS Timezone'},

        ];




        // let's actually execute the subscriptions

        this.sections.forEach(function(section, sectionIndex) {

            this.subscribe(section.field, function(value) {

                // we got a new value for this subscription, let's update it
                this.updateSection(sectionIndex, value);

            }.bind(this));

        }.bind(this));

		// update speedometer label for region
		// window.Logger.debug('region '+this.regions[this.getRegion()].unit);
		// this.speedometerLabel.html(this.regions[this.getRegion()].unit);

    },


	/**
     * (updateSection)
     *
     * This method updates a value and also updates the display if necessary
     */

    updateSection: function(sectionIndex, value) {

        // just in case, let's do some sanity check
        if (sectionIndex < 0 || sectionIndex >= this.sections.length) return false;

		var section = this.sections[sectionIndex],
            name = section.name,
			displayVal;


		if (value === undefined) {
			value = section.value;
		}

		section.value = value;

		if (this.is.fn(section.transform)) {
			// execute the transform
            var result = section.transform(value, sectionIndex);

			// set the updated value
            value = result.value || 0;

            // also set the name if necessary
            name = result.name || name;
        }


		switch (sectionIndex) {
			// MPH
			case 0:
				this.speedometerValue.html(value);
				this.speedometerLabel.html(name);
				break;

			// Heading
			case 2:
				this.headingValue.html(value);
				this.headingLabel.html(name);
				break;

			// fuel level
			case 3:
				displayVal = parseInt(DataTransform.scaleValue(value, [0,255], [0,100]));
				this.fuelLevel.css('width', displayVal+'%');
				this.fuelPercentage.html(displayVal+'%');
				this.fuelLevel.toggleClass('warning', displayVal <= 10);
				break;

			// fuel consumption average
			case 4:
				displayVal = (value === 0) ? '&nbsp;' : value;
				this.avgFuelConsValue.html(displayVal);
				this.avgFuelConsLabel.html(name);
				break;

			// Temperature
			case 5:
				if (value === 255) {
					this.temperature.addClass('invisible');
					displayVal =  '&nbsp;';
				} else {
					this.temperature.removeClass('invisible');
					displayVal =  value;
				}

				this.temperatureValue.html(displayVal);
				this.temperatureLabel.html(name);
				break;

			// GPS Timezone
			case 6:
				this.updateDateTime(value);
				break;

			default:
				break;
		}
    },



})); /** EOF **/
