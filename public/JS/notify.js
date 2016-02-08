$.notifyDefaults({
	// options
	//icon: 'glyphicon glyphicon-warning-sign',
   	//icon:'/public/images/user_online.png',
	//title: 'ZapChat',
	//message: $('#username').text() + ' Online',
	//url: 'https://github.com/mouse0270/bootstrap-notify',
	//target: '_blank'
    position: null,
	//type: "success",
	allow_dismiss: true,
	newest_on_top: false,
	showProgressbar: false,
    placement: {
		from: "top",
		align: "center"
	},
    offset: 0,
	spacing: 10,
	z_index: 1031,
	delay: 5000,
	timer: 1000,
	url_target: '_blank',
	mouse_over: null,
	animate: {
		enter: 'animated bounceInDown',
		exit: 'animated fadeOutUp'
	},
    onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'img',
	template: '<div data-notify="container" class="col-xs-9 col-sm-2 alert alert-{0}" role="alert" style="height:40px !important;padding:5px !important;border-radius: 2px !important;width:270px !important;" >' +
		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<span data-notify="icon"></span> ' +
		//'<span data-notify="title">{1}</span> ' +
		'<span data-notify="message">{2}</span>' +		
	'</div>' 
});

