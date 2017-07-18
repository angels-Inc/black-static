![alt text](Angels,_Inc_Logo.png "Angels, Inc")
Angels, Inc Black Angels website
=================================
[Angels, Inc](https://www.angels-inc.com)

## Files
File | Purpose
---|---
index.html | Main page
index.css | CSS3 definition of main page
langs.css | CSS3 definition for language menu on the page
ft.jpg | First section cover image of the First Tuesday
Angels,_Inc_Logo.png | Company logo used in the header
Guy_Perryman.png | Guy Perryman profile picture as provided by Guy himself along with his bio
bap.jpg | YouTube first snapshot image of the video. Actually the link to YouTube generated image is used instead: <http://img.youtube.com/vi/iGtVq8konNk/0.jpg>
jquery.hoverIntent.js | jQuery plugin to improve from the $.hover() function by attempting to guess the user's intent and has some useful parameters to make the language menu work nicely.
magnific-popup | The magnific popup directory from Dmitry Semenov <http://dimsemenov.com/plugins/magnific-popup/>
jquery.magnific-popup.min.js | The JavaScript of Magnific popup
magnific-popup.css | The CSS for Magnific popup
Tokyo.jpg | The background image used in the contact popup
ua-parser.js | A small library to parse user agent string, which is then used for impeoved css rules


## JavaScript
There was limited use of JavaScript in this document, but to improve usability more of it has been used while only using it as a glue to keep it lightweight. No fancy computation or whatever. I have made heavy use of pure CSS3 features. jQuery is used to provide some additional features proportionally to what is needed to provide the user an easy-to-use and convenient interface. No gadget here.
On Tuesday 4 July 2017, I moved the inline script code to an [external file](./index.js) for better maintenance.

### On load
This is used to display a loading page visual instead of having nothing going on. It usually displays for a couple seconds.
``` JavaScript
$(window).on('load', function()
{
	$('#preloader').addClass('initLog').delay(1900).queue(function()
	{
		$(this).removeClass('initLog').addClass('initLogExit');
		$('body > header, body > label, body > nav, body > main, body > footer').css({'display':'block'});
		$(this).dequeue();
	});
});
```

### On document ready
This is used to enable the JavaScript code once the document is fully loaded.

This sets the available languages and is used by the propagateLang() function to check whether a language requested is actually implemented.
``` JavaScript
window.l10n = {
'en-GB'	: {
	'Undefined' : 'Undefined',
	'Your datetime' : 'Your current local date and time are: %s and it is %s in Tokyo. ',
	'We are opened' : 'We are available. Feel free to call us or send us a mail and we will reply quickly.',
	'We are closed' : 'Sorry, this is outside of our business hours. Please send us a mail and we will get back to you quickly.'
  },
'fr-FR'	: {
	'Undefined' : 'Indéfini',
	'Your datetime' : 'Votre date et heure actuelles sont : %s et il est %s à Tokyo. ',
	'We are opened' : "Nous sommes disponibles. N'hésitez pas à nous appeler ou nous envoyer un courriel et nous répondrons rapidement.",
	'We are closed' : "Désolé, c'est en dehors de nos heures de bureau. Envoyez-nous un courriel et nous vous répondrons rapidement."
  },
'ja-JP' : {
	'Undefined' : '未定義値',
	'Your datetime' : '現在、そちらの時間は%sですが、東京では%sになっております。',
	'We are opened' : '弊社営業時間内ですので、ぜひご架電もしくはメールを配信してください。早くご回答させていただくよう努力します。',
	'We are closed' : 'すみませんが、営業時間外ですので、後ほどご架電していただくか、メールの配信していただければ早くご回答させていただくよう努力します。'
  }
};
```

This is used to set our time zone to guess our visitor's one and do some time computation shown on the contact popup overlay.
``` JavaScript
window.TZ = 'Asia/Tokyo';
```

Then, we have the cookie functions, which we use because sessionStorage or localStorage are nnice but do not last nearly as long and for the convenience of the user, we want to make sure he can keep his preferred language when he visits us.
``` JavaScript
window.setCookie = function(cname, cvalue, exdays)
{
	// Set expiry to 1 month by default
	if( exdays === undefined ) exdays = 30;
	var d = new Date();
	d.setTime( d.getTime() + (exdays * 24 * 60 * 60 * 1000) );
	var expires = "expires=" + d.toUTCString();
	cvalue = encodeURIComponent( JSON.stringify( cvalue ) );
	document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

window.getCookie = function(cname, json)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	var thisCookie = "";
	for(var i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while( c.charAt(0) == ' ' ) c = c.substring(1);
		if( c.indexOf(name) == 0 )
		{
			thisCookie = c.substring( name.length, c.length );
			break;
		}
	}
	if( thisCookie.length )
	{
		thisCookie = decodeURIComponent(thisCookie.replace(/\+/g,  " "));
		return( json ? $.parseJSON( thisCookie ) : thisCookie );
	}
	else
	{
		return( json ? {} : "" );
	}
}

window.eraseCookie = function(name)
{
	createCookie( name, "", -1, "/" );
}
```

This is used to set the menu item as selected if the page was opened with an anchor in it, ie with a target to a section of the page
``` JavaScript
if( window.location.hash.length )
{
  var hash = window.location.hash;
  $( 'nav a' ).each(function(i,e)
  {
    if( hash == e.hash )
    {
      $(this).addClass( 'active' );
    }
    else
    {
      $(this).removeClass( 'active' );
    }
  });
}
```

Next is the localisation propagation based on the interface language active. This makes uses of the standard css :lang selector.
``` JavaScript
window.propagateLang = function( selectedLang )
	{
		if( typeof( l10n[ selectedLang ] ) === 'undefined' )
		{
			return;
		}
		var langLower = new String( selectedLang ).toLowerCase();
		$(':root').attr( 'lang', selectedLang );
		if( $('input[name="lang"][value="' + selectedLang + '"]').length )
		{
			$('input[name="lang"][value="' + selectedLang + '"]').prop( 'checked', true );
		}
		$('title').text( $('title').data( langLower ) );
		$('input,textarea,select').each(function()
		{
			var eType = $(this).type || this.tagName.toLowerCase();
			var eName = $(this).attr('name');
			thisLang = new String( $(this).attr('lang') );
			if( typeof( thisLang ) != typeof( undefined ) &&
				thisLang !== false &&
				thisLang != 'undefined' &&
				thisLang.length > 0 )
			{
				if( $(this).attr('lang') == selectedLang )
				{
					$(this).attr( 'disabled', false );
				}
				else
				{
					$(this).attr( 'disabled', 'disabled' );
				}
			}
		});

		if( cookieData.lang != selectedLang )
		{
			cookieData.lang = selectedLang;
			setCookie(cookieName, cookieData);
		}
	};

	function propagateThisSiteLang(lang)
	{
		if( typeof( propagateLang ) !== 'undefined' && $.isFunction( propagateLang ) )
		{
			propagateLang( lang );
		}
		else
		{
			setTimeout( propagateThisSiteLang(lang), 500 );
		}
	}
```

Then, we have this bit of code to check if the user session has already a language recorded and if so, we set the language as it was. Otherwise we try to find a suitable candidate from the user accepted language, and if this fails, we just propagate the default language set in the html tag.
``` JavaScript
var cookieName = 'baCookie';
var cookieData = getCookie(cookieName, true);
// Do we have a language on record?
if( cookieData.lang )
{
	propagateThisSiteLang( cookieData.lang );
}
// Try to find out from the user accepted languages
else
{
	var prefLang = window.navigator.languages ? window.navigator.languages : window.navigator.userLanguage ? window.navigator.userLanguage : navigator.language ? navigator.language : '';
	var okLang;
	if( prefLang.length )
	{
		prefLang = new String( prefLang );
		var a = prefLang.split( ',' );
		var b = new Array();
		for( var i = 0; i < a.length; i++ )
		{
			if( a[i].indexOf( '-' ) != -1 )
			{
				// Make sure this is in the format of en-GB and not en-gb
				var l1 = a[i].split( '-' )[0];
				var l2 = a[i].split( '-' )[1].toUpperCase();
				console.log( "Replace at offset " + i + " " + a[i] + " with " + [l1, l2].join( '-' ) );
				a.splice( i, 1, [l1, l2].join( '-' ) );
				// For ex, if en-US is found and there is no 'en' in the original list, we add 'en' at the end,
				// so this can match en-GB as an alternative
				if( a.indexOf( l1 ) == -1 )
				{
					b.push( l1 );
				}
			}
		}
		if( b.length > 0 )
		{
			a.push.apply( a, b );
		}

		for( var i = 0; i < a.length; i++ )
		{
			if( typeof( window.l10n[ a[ i ] ] ) !== 'undefined' )
			{
				okLang = a[ i ];
				break;
			}
			else
			{
				Object.keys( window.l10n ).forEach(function(l)
				{
					if( l.split('-')[0] == a[i] )
					{
						okLang = l;
						return;
					}
				});
				if( typeof( okLang ) !== 'undefined' ) break;
			}
		}
	}
	if( typeof( okLang ) !== "undefined" )
	{
		propagateThisSiteLang( okLang );
	}
	else
	{
		propagateThisSiteLang( $(':root').attr( 'lang' ) );
	}
}
```

Add some enhancement to the dom by setting some browser environment variable in the html tag so that it can then referred in css like so:
``` JavaScript
// Enhanced css rules triggered by attributes in the html tag
var parser = new UAParser();
var browser = parser.getBrowser();
var engine = parser.getEngine();
var os = parser.getOS();
var device = parser.getDevice();
// Set some environmental standard values used in css
$(':root').attr( 'data-ua-sig', navigator.userAgent );
$(':root').attr( 'data-ua-code', navigator.appCodeName );
// Useless piece of shit
// $(':root').attr( 'data-ua-name', navigator.appName );
$(':root').attr( 'data-ua-name', parser.getBrowser().name );
$(':root').attr( 'data-ua-platform', navigator.platform );
$(':root').attr( 'data-ua-device', "" );
if( typeof( parser.getDevice().type ) !== 'undefined' ) $(':root').attr( 'data-ua-device', parser.getDevice().type );
$(':root').attr( 'data-ua-os', parser.getOS().name );
```

Then we have this piece of jQuery code to catch any click on the menu items and set the .active class accordingly so the menu item can be displayed as being selected.
I wanted to use the :target selector, but I would have had to make considerable change to the structure of the code just to avoid a small piece of JavaScript, so it was clearly not worth the effort.
``` JavaScript
$('nav a').on('click', function()
{
  //var hash = window.location.hash;
  var hash = $(this).hash;
  $( 'nav a' ).each(function(i,e)
  {
          // checks if its the same on the address bar
    if( hash != e.hash )
    {
      $(this).removeClass( 'active' );
    }
  });
  $(this).addClass( 'active' );
});
```

This code is to handle the navigation menu click and render a smooth scrolling. But not just, it also keeps track in history of the link and associated language, so that if one views a page A in en-GB then switch to ja-JP to view page B, and then press the web browser back button, the page A in English and not in Japanese will be displayed !
``` JavaScript
var lastId,
	topMenu = $('nav'),
	topMenuHeight = topMenu.outerHeight() + 1,
	// All list items, but only anchors items as pointed out by Julian K. in StackOverflow
	menuItems = topMenu.find( 'a[href^="#"]' ),
	// Anchors corresponding to menu items
	scrollItems = menuItems.map(function()
	{
	var item = $( $(this).attr( 'href' ) );
	if( item.length ) { return item; }
	});

console.log( "topMenuHeight: " + topMenuHeight + " and bap offset top is : " + $('#bap').offset().top );
// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e)
{
	e.preventDefault();
	var href = $(this).attr( 'href' );
	scrollAnimate(href);
	if( window.history.pushState )
	{
		if( href.indexOf( document.domain ) > -1 ||
			href.indexOf(':') === -1 )
		{
			//console.log( "Adding url " + href + " to history with language " + $(':root').attr('lang') );
			window.history.pushState({"url": href, "lang": $(':root').attr('lang')}, "", href);
			return false;
		}
	}
});

window.scrollAnimate = function(href)
{
	var offsetTop = -1;
	if( href === '#' )
	{
		offsetTop = 0;
		console.log( "Smooth scrolling down to " + offsetTop + " for " + href );
		$('html, body').stop().animate(
		{
			scrollTop: offsetTop
		}, 850);
	}
	else if( $(href).length )
	{
		var checkObj = function()
		{
			if( $(href).offset().top > 0 )
			{
				console.log( "Div " + href + " is " + $(href).offset().top + " from top." );
				offsetTop = $(href).offset().top - topMenuHeight + 1;
				console.log( "Smooth scrolling down to " + offsetTop + " for " + href );
				$('html, body').stop().animate(
				{
					scrollTop: offsetTop
				}, 850);
			}
			else
			{
				console.log( href + " still has offset to 0. Waiting 0.2 seconds." );
				setTimeout(checkObj,200);
			}
		};
		checkObj();
	}
}

// Bind to scroll
$(window).scroll(function()
{
	// Get container scroll position
	var fromTop = $(this).scrollTop()+ topMenuHeight;

	// Get id of current scroll item
	var cur = scrollItems.map(function()
	{
		if( $(this).offset().top < fromTop )
			return this;
	});
	// Get the id of the current element
	cur = cur[cur.length-1];
	var id = cur && cur.length ? cur[0].id : "";
	//console.log( "Processing id " + id + " versus lastId " + lastId );

	if( lastId !== id )
	{
		lastId = id;
		//console.log( "Remove class 'active' and sets it on " + id );
		// Set/remove active class
		menuItems.removeClass("active");
		menuItems.filter('[href="#' + id + '"]' ).addClass( 'active' );
	 }                   
});

// If we are called with an anchor in the url, make sure we show the corresponding menu item as selected
if( window.location.hash.length )
{
	var hash = window.location.hash;
	$( 'nav a' ).each(function(i,e)
	{
		if( hash == e.hash )
		{
			$(this).addClass( 'active' );
			console.log( "Found a direct entry link to " + window.location.hash + ", moving to " + $(this).attr('href') );
			scrollAnimate( $(this).attr('href') );
		}
		else
		{
			$(this).removeClass( 'active' );
		}
	});
}
```

I spent quite some time to find this information, because the documentation of magnificPopup is not very complete. So after hours of search, I found this pen at <https://codepen.io/meladq/pen/CLqtk>
But since we have video in different language, it is not sufficient to work. We have to control ourself which video should be displayed instead of delegating it to magnific popup. So we monitor click ourself and open magnific popup ourself.
``` JavaScript
$('div.video[lang] .playVideo').on('click',function()
{
	console.log( "Got a click from this div whose language is: " + $(this).parent().parent().attr('lang') + " and who has a class of " + $(this).attr('class') );
	$(this).magnificPopup(
	{
		items:
		{
			src: 'https://www.youtube.com/watch?v=' + $(this).data('video-id')
		},
		type: 'iframe',
		iframe:
		{
			markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
					'</div>',
			patterns:
			{
				youtube:
				{
					index: 'youtube.com/',
					id: 'v=',
					src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0'
				}
			},
			srcAction: 'iframe_src',
		},
	}).magnificPopup('open');
});
```

This is used to monitor any escape key press to discard the "about Guy" popup layer.
Since we use CSS3 to display the window, the anchor is the same as the div id. In our case #maestro. When setting the current address at something else, in CSS, this closes the window without using any JavaScript ! :-)
``` JavaScript
$(document).keyup(function(e)
{
  var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
  if( key == 27 )
  {
		$('.modal').hide();
		$('#mask').hide();
  }
});
```

If a click is made outside of the "about Guy" or the contact popup layer, then they get closed.
``` JavaScript
$(document).on('click', function(e)
{
	if( $('.modal').is( ':visible' ) )
	{
		// if the target of the click isn't the container...
		if( !$('.modal').is( e.target )
			// ... nor a descendant of the container
			&& $('.modal').has( e.target ).length === 0 &&
			!$('#showMaestro').is( e.target ) &&
			!$('.showContact').is( e.target ) )
		{
			$('.modal').hide();
			$('#mask').hide();
			// No need to continue updating our availability if the contact window is not up
			if( window.AVAIL_CHECK !== 'undefined' ) clearInterval(window.AVAIL_CHECK);
		}
	}
});
```

Display the about Guy Perryman popup overlay
``` JavaScript
$('#showMaestro').on('click', function(e)
{
	e.preventDefault();
	// If another modal is opened, close it now.
	if( $('.modal').is( ':visible' ) )
	{
		$('.modal').hide();
	}
	$('#maestro').show();
	$('#mask').show();
});

$('.modal .close, .modal .button').on('click', function()
{
	$('.modal').hide();
	$('#mask').hide();
	if( window.AVAIL_CHECK !== 'undefined' ) clearInterval(window.AVAIL_CHECK);
});
```

We set a hook to monitor any mouse over the language menu to display it. No need to click on it to reveal it as it would be an extra step and people would not necessarily know they had to click on it.
We use this jQuery plugin to provide richer control attribute. The initial pure CSS3 implementation did not work, because of the small space gap between the flag showing up when closed and the language menu list block. When moving from one to another, it loses focus and the list would get closed inadvertedly. Using hoverIntent() plugin solved that problem.
``` JavaScript
$('#langMenu').hoverIntent(
{
  over : function()
  {
    if( $('input[name=toggle]:checked').length > 0 )
    {
      return false;
    }
    $(this).attr( 'open', true );
  },
  out : function()
  {
    $(this).removeAttr( 'open' );
  },
  timeout : 500
});
```

Capture a language selection and propagate it using the propagateLang() function.
``` JavaScript
$('input[name=lang]').on( 'change', function(e)
{
  if( typeof( l10n[ $(this).val() ] ) == 'undefined' )
  {
    return false;
  }
  propagateThisSiteLang( $(this).val() );
});
```

If the contact popup is opened, we update every minute the availability information box.
``` JavaScript
$('.showContact').on('click', function()
{
	if( $('.modal').is( ':visible' ) )
	{
		$('.modal').hide();
	}
	$('#contact').show();
	$('#mask').show();
	availability();
	window.AVAIL_CHECK = setInterval(availability,60000);
});
```

This is a little trick to obfuscate an e-mail address, because it requires for the spam bot to 1) render the css properly and make a user click while a perfectly good, but fake e-mail address is in the href link as a bait. Real users will get the real e-mail, the bots will get a fake one. It uses standard css3 technique and a bit of JavaScript here to make the glue.
The first time the user click, the fake e-mail address gets changed by the real one stored as inverted strings in data attributes !!
``` JavaScript
$('.courriel').on('click', function(e)
{
	if( !$(this).data('decoded') )
	{
		e.preventDefault();
		function decode(a, r)
		{
			return a.split( '' ).reverse().join( '' );
		};
		var y = decode( $(this).data('user') ) + '@' + decode( $(this).data('website') );
		$(this).attr("href", 'mai' + 'lto:' + y);
		$(this).data( 'decoded', true );
		window.location.href = 'mai' + 'lto:' + y;
	}
});
```
Those codes are used in the contact popup layer to show the availability of Angels, Inc office notwithstanding from which country the user visits us. This is important because with Internet, you do not know the local time of the company whose website you visit.
``` JavaScript
	function getLocalDateTime()
	{
		var date = new Date();
		var d = moment.utc(date.toISOString());
		if( !sessionStorage.getItem('timezone') )
		{
			var tz = jstz.determine() || 'UTC';
			sessionStorage.setItem('timezone', tz.name());
		}
		var currTz = sessionStorage.getItem('timezone');
		return( d.tz(currTz) );
	}

    function interpolate(str, args) {
        var _str = str;
        Object.keys(args).forEach(function(arg) {
            var value = args[arg];
            var regx = new RegExp('%\\(' + arg + '\\)', 'g');
            _str = _str.replace(regx, value)
        });
        return _str;
    }

	function availability()
	{
		if( $('#contact').is(':visible') )
		{
			var d = getLocalDateTime();
			var d2 = d.clone().tz( TZ );
			d.locale( $(':root').attr( 'lang' ) );
			d2.locale( $(':root').attr( 'lang' ) );
			var localeAvailability = '';
			if( d.tz.name != TZ ) localeAvailability += interpolate( l10n[ $(':root').attr( 'lang' ) ][ 'Your datetime' ], {
                localTime: d.format( 'LLLL' ),
                jstTime: d2.format('LLLL')
            });
			if( d2.format('H') >= 9 && d2.format('H') <= 20 &&
				!( d2.format('d') == 0 || d2.format('d') == 1 ) )
			{
				localeAvailability += l10n[ $(':root').attr( 'lang' ) ][ 'We are opened' ];
			}
			else
			{
				localeAvailability += l10n[ $(':root').attr( 'lang' ) ][ 'We are closed' ];
			}
			$('.availability').html( localeAvailability );
		}
	}
```

Monitor the user click on his/her web browser back or forward button so we can display the page in the right language. Nothing happens if the history feature is not supported by an old web browser.
``` JavaScript
$(window).on("popstate", function(e)
{
	var data = e.originalEvent.state;
	if( data !== null )
	{
		var lang = data.lang;
		//console.log( "Found page " + data.url + " with language " + data.lang );
		if( lang != $(':root').attr( 'lang' ) )
		{
			//console.log( "Language in history (" + data.lang + ") is different than our current one, changing." );
			propagateLang( lang );
		}
	}
});
```

## Localisation (L10N)
### Formatting and structure
The Localisation follows the CSS3 standards, ie to localise from the loading the document into either British English, French or Japanese, set the html tag to the iso639 code such as:
``` html
<html lang="en-GB">
```
The JavaScript function propagateThisSiteLang() will call the function propagateLang() after the page is loaded to ensure the right localised text is displayed.

The localised text is set as tags with the lang selector set, such as in the page navigation menu:
``` html
<a href="#intro"><span lang="fr-FR">Home</span><span lang="en-GB">Home</span><span lang="ja-JP">ホーム</span></a>
```
Here the localised text is in a span tag, but if we wanted to localise a select menu, we could simply create different version of the select menu with he right language selector, such as:
``` html
<select lang="en-GB">...</select>
<select lang="ja-JP">...</select>
```
In the title tag, we use another slightly non-standard way to disply localised title without putting any span tag in it, which obviously would not work. The following is recognised by the propagateLang() function. Note that the language is all lower cap.
``` html
<title
  data-fr-fr="Angels, Inc Black Angels"
  data-en-gb="Angels, Inc Black Angels"
  data-ja-jp="エンジェルズインクのブラックエンジェルズ"
>Angels, Inc Black Angels</title>
```

The language code naming standards must be language-Country Code and in the case of UK, the country code is GB, not UK. There is no such thing as en-UK. See here the [ISO standard](https://www.iso.org/iso-3166-country-codes.html) for more information.

The CSS file [langs.css](./langs.css) contains all the specifications including the base 64 encoded country flags so there is no need to keep in mind to also copy whatever country flags are necessary. However, since there are over 250 countries, I only added the country flags of Asian countries.

### User interface
The language change selector is located at the top right, which is the expected location according to [this user study](http://flagsarenotlanguages.com/blog/2013/10/case-study-onefinestay-com-and-dropdown-language-selection/).
Once the language is set, it is remembered as a session information stored in the client-side.

## Invitation code (proposal)
An invitation payload to become a black angel member may be passed to the page via the querystring. If said parameter exists, customized content and CTA buttons may be displayed. Note that the following specification is at the proposal stage.

### Query parameter
The query parameter used is `invite` for example: `https://black.angels-inc.com?invite=...`

### Payload encoding
The payload is base64 encoded.

###Payload specification
The payload is a string representation of the following JSON payload

```JSON
{
  "firstName": "John",
  "lastName": "Doe",
  "locale": "ja-JP",
  "inviteId" : "cj49myzav6tlz01753hlu94s9"
}
```

firstname : String!

lastName: String!

locale: String Enum! ["en-US", "ja-JP"]

inviteID: ID! (In its GraphQl representation)

An example of the target url once the payload is base64 encoded :

`https://black.angels-inc.com?invite=ew0KICAiZmlyc3ROYW1lIjogIkpvaG4iLA0KICAibGFzdE5hbWUiOiAiRG9lIiwNCiAgImxvY2FsZSI6ICJqYS1KUCIsDQogICJpbnZpdGVJZCIgOiAiY2o0OW15emF2NnRsejAxNzUzaGx1OTRzOSINCn0g`

### Payload parsing example
``` JavaScript
const qs = new URLSearchParams(window.location.search);
const encodedPayload = qs.get('invite');
const decodedPayload = atob(encodedPayload);
try {
  const { firstName, lastName, locale, inviteId } = JSON.parse(decodedPayload);
}
catch(e) {
  console.error(e);
}
```

## To do
1. Build the icons referenced in the header
1. Create a robots.txt file
1. ~~Remove the unused language from the menu as they are here just to test~~
1. ~~Change the CSS in [index.css](./index.css) so a selected menu item is shown as selected~~ (fix #6)
1. Set overflow to default for the mobile version so the menu can be scrolled
1. Add the logo or other brand assets of the sponsors on the bottom of the page
1. Add also the picture of key participants to influence others to join as well.

See <https://github.com/angels-Inc/black-static/issues> for more !
