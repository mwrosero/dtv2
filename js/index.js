/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var id_of_page="";
var sesion_activa=0;
var alto = $(window).height()*0.23;
var cambioPantalla=0;

var nombre_eq_local;
var nombre_eq_visitante;

var re_login=0;

var name_image = "";
var name_image_cargada = "";
var pictureSource;   
var destinationType; 
var editar=0;
var id_usuario=0;
var cambioFoto=0;
var id_partido=0;
var num_fecha;
var alto_equipo_li;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        /*setTimeout(function(){
            if(sesion_activa){
                //alert('Ya esta en FB');
            }else{
                //alert('No esta en FB');
                //promptLogin();
            }
        },1000);*/
        
        //alert($(window).height());
        modificarCss();

        $('.porta-imagen').css("height",alto+"px");
        
        $('#btn_registrar').click(function(){
            $('#btn_registrar').css("visibility","hidden");
            validarRegistro();
            //registrarUsuario();
            //goTo('#home-page');
        });

        $('#pro_fecha').click(function(){
            //realizar validaciones
            puedePronosticarFecha();
            //goTo('#fecha-page');
        });

        $('#pro_completo').click(function(){
            //realizar validaciones
            //goTo('#completo-page');
            puedePronosticarCompleto();
        });

        $('#btn_editar').click(function(){
            editar=1;
            habilitarCampos();
            $('#btn_editar').css("visibility","hidden");
            $('#btn_cerrar_sesion').css("display","none");
            $('#btn_guardar').css("display","inline");
        });

        $('#btn_guardar').click(function(){
            editar=0;
            deshabilitarCampos();
            $('#btn_guardar').css("display","none");
            $('#btn_cerrar_sesion').css("display","inline");
            $('#btn_editar').css("visibility","visible");
            modificarUsuario();
            $('.fixed-header').show();
            $('.fixed-footer').show();
            $('.nada_mas').show();
            $('.contenedor').css("margin-top","20%");
            $('login-contenido').css("margin-top","40%");
        });

        $('#btn_guardar_pro_fecha').click(function(){
            var mar_l = $('#marcador_local').val();
            var mar_v = $('#marcador_visitante').val();
            if(mar_l.length>0 && mar_v.length>0){
                //alert('Mi pronóstico DIRECTV por la fecha #'+num_fecha+' del Campeonato es: '+nombre_eq_local+': '+mar_l+' vs. '+nombre_eq_visitante+': '+mar_v);
                navigator.notification.confirm(
                    ("Todos los pronósticos seleccionados no podrán ser guardados después de este punto."), // message
                    consultaGuardarFecha, // callback
                    'DirecTV', // title
                    'Guardar,Regresar' // buttonName
                );
            }else{
                navigator.notification.alert(
                    'Marcador incorrecto',  // message
                    alertDismissed,         // callback
                    'Atención',            // title
                    'Aceptar'                  // buttonName
                );
            }
            
        });

        $('#btn_guardar_pro_completo').click(function(){
            navigator.notification.confirm(
                ("Todos los pronósticos seleccionados no podrán ser guardados después de este punto."), // message
                consultaGuardarCompleto, // callback
                'DirecTV', // title
                'Guardar,Regresar' // buttonName
            );
        });

        $('#btn_add_perfil').click(function(){
            if(editar==1){
                getPhoto(pictureSource.PHOTOLIBRARY);
                cambioFoto=1;
            }
        });

        $('#btn_cerrar_sesion').click(function(){
            navigator.notification.confirm(
                ("¿Desea cerrar sesión?"), // message
                cerrarSesionDef, // callback
                'DirecTV', // title
                'Si,No' // buttonName
            );            
        });

        $('.soloNumero').bind('keypress', function (e) {
            return (e.which < 48 || e.which > 57) ? false : true;
        });

        $('.soloEmail').bind('keypress', function (e) {
            return (e.which!=64 && e.which!=46 && e.which!=45 && e.which!=95 && (e.which < 48 || e.which > 57) && (e.which < 97 || e.which > 122) && (e.which < 65 || e.which > 90)) ? false : true;
        });

        $('.soloTexto').bind('keypress', function (e) {
            return (e.which!=32 && (e.which < 97 || e.which > 122) && (e.which < 65 || e.which > 90)) ? false : true;
        });

        window.onresize = function () {
            //alert(0);
            if(cambioPantalla==0){
                cambioPantalla=1;
                $('.fixed-header').hide();
                $('.fixed-footer').hide();
                $('.nada_mas').hide();
                $('.contenedor').css("margin-top","2%");
                $('.login-contenido').css("margin-top","2%");
            }else{
                cambioPantalla=0;
                $('.fixed-header').show();
                $('.fixed-footer').show();
                $('.nada_mas').show();
                $('.contenedor').css("margin-top","20%");
                $('.login-contenido').css("margin-top","40%");
            }
        };
        //window.addEventListener('resize', function() { alert(window.innerHeight); });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        setTimeout(function(){
            document.addEventListener('deviceready', onDeviceReady, false);
        },1500);
        //document.addEventListener('deviceready', onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function onDeviceReady() {
    //alert("Device Ready");
    alert(device.uuid);
    document.addEventListener("showkeyboard", function(){ 
        //alert("Keyboard is ON");
        $('.fixed-header').hide();
        $('.fixed-footer').hide();
        $('.nada_mas').hide();
        $('.contenedor').css("margin-top","2%");
        $('login-contenido').css("margin-top","2%");
    }, false);
    document.addEventListener("hidekeyboard", function(){ 
        //alert("Keyboard is OFF");
        $('.fixed-header').show();
        $('.fixed-footer').show();
        $('.nada_mas').show();
        $('.contenedor').css("margin-top","20%");
        $('login-contenido').css("margin-top","40%");
    }, false);
    document.addEventListener("backbutton", function(){
        if(id_of_page=="login-page" || id_of_page=="home-page"){
            //salir
            navigator.notification.confirm(
                ("¿Desea salir?"), // message
                alertexit, // callback
                'DirecTV', // title
                'Si,No' // buttonName
            );
        }else{
            if(id_of_page=="registro-page" || id_of_page=="olvido-page"){
                goTo('#login-page');
            }else{
                goTo('#home-page');
            }
        }
    }, true);
    document.addEventListener("menubutton", function(){
        //alert("menu");
    }, false);
    document.addEventListener("offline", function(){
         navigator.notification.alert(
            'Necesita internet para usar la App.',  // message
            alertDismissed,         // callback
            'Atención',            // title
            'Reintentar'                  // buttonName
        );
        //goTo('#internet-page');
    }, false);
    document.addEventListener("online", function(){
        //alert("Volvio el internet");
        //goTo('#home-page');
        //parent.history.back();
        //parent.history.go(-2);
    }, false);

    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

function alertDismissed() {
    // do something
}


function alertexit(button){
    if(button=="1" || button==1){
        device.exitApp();
    }
}

function consultaGuardarFecha(button){
    if(button=="1" || button==1){
        guardarPronosticoFecha();
    }
}

function consultaGuardarCompleto(button){
    if(button=="1" || button==1){
        guardarPronosticoCompleto();
    }
}

function cerrarSesionDef(button){
    if(button=="1" || button==1){
        $('#pass_txt').val("");
        $('#marcador_local').val("");
        $('#marcador_visitante').val("");
        limpiarCamposRegistro();
        re_login=1;
        goTo('#login-page');
    }
}

function limpiarCamposRegistro(){
    $('#txt_nombre').val("");
    $('#txt_ciudad').val("");
    $('#txt_telefono').val("");
    $('#txt_email').val("");
    $('#txt_clave').val("");
    $('#txt_id').val("");
    var largeImage = document.getElementById('img-seleccionada');
    largeImage.style.display = 'block';
    largeImage.src = "";
}

var sinInternetPage=0;

$(document).on("pagechange", function (e, data) {
    //alert(data.toPage[0].id);
    id_of_page=data.toPage[0].id;
    /*if(id_of_page=="login-page" || id_of_page=="olvido-page" || id_of_page=="registro-page"){
        sinInternetPage=1;
    }*/
});

function goTo(_pageid) {
    $.mobile.changePage(_pageid, {
        transition: "none",
        reverse: false,
        changeHash: false
    });
}

function validarRegistro(){
    var flag_email=0;
    var nombre = $('#txt_nombre').val().length;
    var ciudad = $('#txt_ciudad').val().length;
    var telefono = $('#txt_telefono').val().length;
    var email = $('#txt_email').val();
    var clave = $('#txt_clave').val().length;
    var id_directv = $('#txt_id').val().length;

    if (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/.test(email)){
        flag_email=1;
    }else{
        flag_email=0;
    }

    if(nombre>0 && ciudad>0 && telefono>0 && flag_email && agregoImg && clave>0 && id_directv>0){
        registrarUsuario();
    }else{
        navigator.notification.alert(
            'Formulario incompleto',  // message
            alertDismissed,         // callback
            'Atención',            // title
            'Volver'                  // buttonName
        );
        $('#btn_registrar').css("visibility","visible");
    }
    
}

function cambiarInput(){
    $("#txt_nombre_ed").textinput('disable');   
    $("#txt_ciudad_ed").textinput('disable');   
    $("#txt_telefono_ed").textinput('disable'); 
    $("#txt_email_ed").textinput('disable');    
    $("#txt_id_ed").textinput('disable');  
}

function habilitarCampos(){
    $("#txt_nombre_ed").textinput('enable');
    $("#txt_ciudad_ed").textinput('enable');
    $("#txt_telefono_ed").textinput('enable');
    $("#txt_email_ed").textinput('enable');
    $("#txt_id_ed").textinput('enable');
}

function deshabilitarCampos(){
    $("#txt_nombre_ed").textinput('disable');   
    $("#txt_ciudad_ed").textinput('disable');   
    $("#txt_telefono_ed").textinput('disable'); 
    $("#txt_email_ed").textinput('disable');    
    $("#txt_id_ed").textinput('disable');   
}

var imageURI_tmp;
var agregoImg=0;
function onPhotoURISuccess(imageURI) 
{
    agregoImg=1;
    console.log(imageURI);
    //alert(imageURI);
    var largeImage = document.getElementById('img-seleccionada');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
    //$('#img-seleccionada').attr('src',imageURI);
    imageURI_tmp = imageURI;
    //uploadPhoto(imageURI);
    cambioFoto=1;
    if(editar==1){
        var largeImage = document.getElementById('img-perfil');
        largeImage.style.display = 'block';
        largeImage.src = imageURI;
    }
}

function onPhotoDataSuccess(imageURI) 
{ 
    var imgProfile = document.getElementById('imgProfile');
    imgProfile.src = imageURI;
    if(sessionStorage.isprofileimage==1)
    {
        getLocation();
    }
    movePic(imageURI);
}

function onFail(message) 
{
    alert('Failed because: ' + message);
}

function movePic(file)
{ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

function resolveOnSuccess(entry)
{ 
    var d = new Date();
    var n = d.getTime();
    var newFileName = n + ".jpg";
    var myFolderApp = "MyAppFolder";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) 
    {      
        fileSys.root.getDirectory( myFolderApp,
                {create:true, exclusive: false},
                function(directory) 
                {
                    entry.moveTo(directory, newFileName,  successMove, resOnError);
                },
        resOnError);
    },
    resOnError);
}

function successMove(entry) 
{
    sessionStorage.setItem('imagepath', entry.fullPath);
}

function resOnError(error) 
{
    alert(error.code);
}

function capturePhotoEdit() 
{
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.DATA_URL });
}

function getPhoto(source) 
{
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

function onFail(message) 
{
    //alert('Failed because: ' + message);
    cambioFoto=0;
}

/*Upload foto*/

function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";

    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;
    options.chunkedMode = false;

    //alert('imageURI:'+imageURI);
    //alert('name_image:'+name_image);

    var ft = new FileTransfer();
    ft.upload(imageURI, "http://maruridigitaldev.com/bin/directv/movil/pronostico_app/services/upload_image.php?nombre_imagen="+name_image, win, fail, options);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    //alert('ok'+r.response);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
}

function registrarUsuario(){
    //alert(0);
    var random_ = Math.floor((Math.random()*1000000000)+1);
    
    var nombre = $('#txt_nombre').val();
    var ciudad = $('#txt_ciudad').val();
    var telefono = $('#txt_telefono').val();
    var email = $('#txt_email').val();
    var clave = $('#txt_clave').val();
    var id_directv = $('#txt_id').val();

    name_image = id_directv+'_'+random_+'.jpg';

    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/guardar_registro.php',
        type: "post",           
        cache: false,
        data: "nombre="+nombre+"&ciudad="+ciudad+"&telefono="+telefono+"&email="+email+"&clave="+clave+"&id_directv="+id_directv+"&ruta_imagen="+name_image,
        dataType: "json",                               
        success: function(response){
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    //alert('entro'+value.existe);
                    if(value.existe=='1'){
                        //alert('Código DirecTV ya registrado');
                        navigator.notification.alert(
                            'Código DirecTV ya registrado',// message
                            alertDismissed,       // callback
                            'Atención',           // title
                            'Aceptar'             // buttonName
                        );
                        $('#btn_registrar').css("visibility","visible");
                    }else{
                        uploadPhoto(imageURI_tmp);
                        loginAfterRegistro();
                    }
                });
            }else{
                //alert('Campos incompletos');
                navigator.notification.alert(
                    'Campos incompletos',// message
                    alertDismissed,       // callback
                    'Atención',           // title
                    'Aceptar'             // buttonName
                );
                $('#btn_registrar').css("visibility","visible");
            }
            
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 
}

function login(){
    $('#btn_iniciar').css("visibility","hidden");
    var user = $('#user_txt').val();
    var clave = $('#pass_txt').val();
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/login.php',
        type: "post",           
        cache: false,
        data: "user="+user+"&clave="+clave,
        dataType: "json",                               
        success: function(response){ 
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    //alert('entro'+value.existe);
                    if(value.existe=='1'){
                        //alert('Usuario existe');
                        id_usuario=value.id_usuario;
                        name_image_cargada=value.nombre_imagen;
                        cargarperfil(value.nombre,value.ciudad,value.telefono,value.email,value.id_directv,value.nombre_imagen);
                        cargarPartido();
                        cargarEquipos();
                            //alert(sesion_activa);
                        goTo('#home-page');
                    }else{
                        //alert('Usuario no existe');
                        navigator.notification.alert(
                            'Usuario no existe',// message
                            alertDismissed,       // callback
                            'Atención',           // title
                            'Aceptar'             // buttonName
                        );
                    }
                });
            }else{
                //alert('Campos incompletos');
                navigator.notification.alert(
                    'Campos incompletos',// message
                    alertDismissed,       // callback
                    'Atención',           // title
                    'Aceptar'             // buttonName
                );
            }
            $('#btn_iniciar').css("visibility","visible");
        }, 
        beforeSend: function () { null; }, 
        error : function(error){
            $('#btn_iniciar').css("visibility","visible"); 
        }
    }); 
}

function loginAfterRegistro(){
    var user = $('#txt_email').val();
    var clave = $('#txt_clave').val();
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/login.php',
        type: "post",           
        cache: false,
        data: "user="+user+"&clave="+clave,
        dataType: "json",                               
        success: function(response){ 
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    //alert('entro'+value.existe);
                    if(value.existe=='1'){
                        //alert('Usuario existe');
                        id_usuario=value.id_usuario;
                        name_image_cargada=value.nombre_imagen;
                        setTimeout(function(){
                            cargarperfil(value.nombre,value.ciudad,value.telefono,value.email,value.id_directv,value.nombre_imagen);
                        },1000);
                        
                        cargarPartido();
                        cargarEquipos();
                        goTo('#home-page');
                    }else{
                        //alert('Usuario no existe');
                    }
                });
            }else{
                //alert('Campos incompletos');
            }
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 
}

function cargarperfil(nombre,ciudad,telefono,email,id_directv,imagen){
    $("#txt_nombre_ed").val(nombre);
    $("#txt_ciudad_ed").val(ciudad);
    $("#txt_telefono_ed").val(telefono);
    $("#txt_email_ed").val(email);
    $("#txt_id_ed").val(id_directv);

    var largeImage = document.getElementById('img-perfil');
    largeImage.style.display = 'block';
    largeImage.src = 'http://maruridigitaldev.com/bin/directv/movil/pronostico_app/services/archivos/'+imagen;

}

function modificarUsuario(){
    var random_ = Math.floor((Math.random()*1000000000)+1);
    
    var nombre = $('#txt_nombre_ed').val();
    var ciudad = $('#txt_ciudad_ed').val();
    var telefono = $('#txt_telefono_ed').val();
    var email = $('#txt_email_ed').val();
    var id_directv = $('#txt_id_ed').val();

    if(cambioFoto==1){
        name_image="";
        name_image = id_directv+'_'+random_+'.jpg';
        //alert(name_image);
    }else{
        name_image=name_image_cargada;
        //alert('no cambio:'+name_image);
    }
    //alert('id_usuario:'+id_usuario);
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/modificar_registro.php',
        type: "post",           
        cache: false,
        data: "id_usuario="+id_usuario+"&nombre="+nombre+"&ciudad="+ciudad+"&telefono="+telefono+"&email="+email+"&id_directv="+id_directv+"&ruta_imagen="+name_image,
        //dataType: "json",                               
        success: function(response){                           
            //alert(3);
            if(cambioFoto==1){
                uploadPhoto(imageURI_tmp);
            }            
            //alert(response);
            navigator.notification.alert(
                'Datos modificados',// message
                alertDismissed,       // callback
                'Atención',           // title
                'Aceptar'             // buttonName
            );
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 
}

function cargarPartido(){
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/obtener_partido.php',
        type: "post",           
        cache: false,
        //data: "id_usuario="+id_usuario+"&nombre="+nombre+"&ciudad="+ciudad+"&telefono="+telefono+"&email="+email+"&id_directv="+id_directv+"&ruta_imagen="+name_image,
        //dataType: "json",                               
        success: function(response){
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    //alert('entro'+value.existe);
                    if(value.existe=='1'){
                        //alert('Usuario existe');
                        id_partido=value.id_partido;
                        num_fecha=value.fecha_campeonato;
                        nombre_eq_local=value.nombre_local;
                        nombre_eq_visitante=value.nombre_visitante;
                        cargarPronosticoFecha(value.id_local,value.id_visitante,value.nombre_local,value.nombre_visitante,value.canal_partido,value.fecha_campeonato,value.hora_partido,value.escudo_equipo_local,value.escudo_equipo_visitante);
                    }else{
                        alert('Partido no cargado');
                    }
                });
            }else{
                alert('No hay partido');
            }
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 
}

function cargarPronosticoFecha(id_local,id_visitante,nombre_local,nombre_visitante,canal_partido,fecha_campeonato,hora_partido,escudo_equipo_local,escudo_equipo_visitante){
    $('#fecha_pronostico_fecha').html('FECHA '+fecha_campeonato+' - '+hora_partido);
    $('#canal_pronostico_fecha').html('Transmitido por Canal '+canal_partido);
    $('#nombre_equipo_local').html(nombre_local);
    $('#nombre_equipo_visitante').html(nombre_visitante);
    //alert(escudo_equipo_local+'-'+escudo_equipo_visitante);
    var largeImage1 = document.getElementById('escudo_local');
    largeImage1.style.display = 'block';
    largeImage1.src = 'http://maruridigitaldev.com/bin/directv/movil/pronostico_app/services/escudos/'+escudo_equipo_local;
    var largeImage2 = document.getElementById('escudo_visitante');
    largeImage2.style.display = 'block';
    largeImage2.src = 'http://maruridigitaldev.com/bin/directv/movil/pronostico_app/services/escudos/'+escudo_equipo_visitante;
}

function cargarEquipos(){
    $('#sortable li').remove();
    $('#sortable li').listview('refresh');
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/obtener_equipos.php',
        type: "post",           
        cache: false,
        //data: "id_usuario="+id_usuario+"&nombre="+nombre+"&ciudad="+ciudad+"&telefono="+telefono+"&email="+email+"&id_directv="+id_directv+"&ruta_imagen="+name_image,
        //dataType: "json",                               
        success: function(response){
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    cargarPronosticoCompleto(value.id_equipo,value.nombre_equipo,value.escudo_equipo);
                });
            }else{
                alert('No hay equipo');
            }
            i/*f(re_login==0){
                alto_equipo_li = $('.contenedor-equipos ul li img').height();
            }else{
                $('.contenedor-equipos ul li img').css("height",alto_equipo_li+"px");
            }
            alert(al)*/
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 
}

function cargarPronosticoCompleto(id_equipo,nombre_equipo,escudo_equipo){
    $('#sortable').append('<li id="'+id_equipo+'"><img src="http://maruridigitaldev.com/bin/directv/movil/pronostico_app/services/escudos/'+escudo_equipo+'"><span>'+nombre_equipo+'</span></li>');
}

function puedePronosticarFecha(){
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/obtener_usuario_fecha.php',
        type: "post",           
        cache: false,
        data: "id_usuario="+id_usuario+"&id_partido="+id_partido,
        //dataType: "json",                               
        success: function(response){
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    //alert(value.existe);
                    if(value.existe=='0'){
                        goTo('#fecha-page');                        
                    }else{
                        //alert('Ya ha pronosticado');
                        if(value.existe=='1'){
                            navigator.notification.alert(
                                value.mensaje,// message
                                alertDismissed,       // callback
                                'Atención',           // title
                                'Aceptar'             // buttonName
                            );
                        }else{
                            navigator.notification.alert(
                                value.mensaje,// message
                                alertDismissed,       // callback
                                'Atención',           // title
                                'Aceptar'             // buttonName
                            );
                        }
                    }
                });
            }else{
                alert('No hay datos de pronostico');
            }
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    });
}

function guardarPronosticoFecha(){
    var res_local = $('#marcador_local').val();
    var res_visitante = $('#marcador_visitante').val();
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/guardar_pronostico_fecha.php',
        type: "post",           
        cache: false,
        data: "id_usuario="+id_usuario+"&id_partido="+id_partido+"&res_local="+res_local+"&res_visitante="+res_visitante,
        //dataType: "json",                               
        success: function(response){
            goTo('#home-page');
            //alert('Acaba de pronosticar exitosamente');
            publicarFb();
            /*navigator.notification.alert(
                'Acaba de pronósticar exitosamente.',// message
                alertDismissed,       // callback
                'Atención',           // title
                'Aceptar'             // buttonName
            );*/
            
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 
}

function puedePronosticarCompleto(){
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/obtener_usuario_completo.php',
        type: "post",           
        cache: false,
        data: "id_usuario="+id_usuario,
        //dataType: "json",                               
        success: function(response){
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    //alert(value.existe);
                    if(value.existe=='0'){
                        goTo('#completo-page');                        
                    }else{
                        //alert('Ya ha pronosticado');
                        if(value.existe=='1'){
                            navigator.notification.alert(
                                value.mensaje,// message
                                alertDismissed,       // callback
                                'Atención',           // title
                                'Aceptar'             // buttonName
                            );
                        }else{
                            navigator.notification.alert(
                                value.mensaje,// message
                                alertDismissed,       // callback
                                'Atención',           // title
                                'Aceptar'             // buttonName
                            );
                        }
                    }
                });
            }else{
                alert('No hay datos de pronostico');
            }
        }, 
        beforeSend: function () {
            //$.mobile.showPageLoadingMsg();
        },
        complete: function() { 
            //$.mobile.hidePageLoadingMsg() 
        }, 
        error : function(error){ null; }
    });
}

$(document).ajaxSend(function() {
    //$.mobile.loading( 'show');
    $.mobile.showPageLoadingMsg("b", "Cargando...");
});
$(document).ajaxComplete(function() {
    $.mobile.loading( 'hide');
});

function guardarPronosticoCompleto(){
    //alert('Completo');
    var equipos_orden = "";
    $('#sortable li').each(function(index){
        //alert($(this).attr('id')+": "+$(this).text());
        equipos_orden = equipos_orden+$(this).attr('id')+"-";
    });

    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/guardar_pronostico_completo.php',
        type: "post",           
        cache: false,
        data: "id_usuario="+id_usuario+"&equipos="+equipos_orden,
        //dataType: "json",                               
        success: function(response){
            goTo('#home-page');
            //alert('Acaba de pronosticar exitosamente');
            publicarFb_Completo();
            /*navigator.notification.alert(
                'Acaba de pronósticar exitosamente.',// message
                alertDismissed,       // callback
                'Atención',           // title
                'Aceptar'             // buttonName
            );*/
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ null; }
    }); 

}

function publicarFb(){
    var res_loc = $('#marcador_local').val();
    var res_vis = $('#marcador_visitante').val();

    //alert('Mi pronóstico DIRECTV por la fecha #'+num_fecha+' del Campeonato es: '+nombre_eq_local+': '+res_loc+' vs. '+nombre_eq_visitante+': '+res_vis);

    if(sesion_activa){
        FB.api('/me/feed', 'post', {message: 'Mi pronóstico DIRECTV por la fecha #'+num_fecha+' del Campeonato es: '+nombre_eq_local+': '+res_loc+' vs. '+nombre_eq_visitante+': '+res_vis});
    }else{
        //promptLogin();
        FB.login(function(){
            FB.api('/me/feed', 'post', {message: 'Mi pronóstico DIRECTV por la fecha #'+num_fecha+' del Campeonato es: '+nombre_eq_local+': '+res_loc+' vs. '+nombre_eq_visitante+': '+res_vis});
        }, {scope: 'publish_actions'});
    }    
}

function publicarFb_Completo(){
    if(sesion_activa){
        FB.api('/me/feed', 'post', {message: 'Acabo de pronósticar las posiciones finales del Campeonato con DIRECTV'});
    }else{
        //promptLogin();
        FB.login(function(){
            FB.api('/me/feed', 'post', {message: 'Acabo de pronósticar las posiciones finales del Campeonato con DIRECTV'});
        }, {scope: 'publish_actions'});
    }    
}

function recuperarClave(){
    $('#btn_enviar').css("visibility","hidden");
    var email_l = $('#user_txt_ol').val();
    $.ajax({ 
        url: 'http://198.211.103.18/bin/directv/movil/pronostico_app/services/enviar_clave.php',
        type: "post",           
        cache: false,
        data: "email="+email_l,
        dataType: "json",                               
        success: function(response){
            if (response != null && response != '' && response != '[]'){                          
                $.each(response, function (key, value){
                    navigator.notification.alert(
                        value.mensaje,// message
                        alertDismissed,       // callback
                        'Atención',           // title
                        'Aceptar'             // buttonName
                    );
                });
            }else{
                alert('No hay datos');
            }
            $('#btn_enviar').css("visibility","visible");
        }, 
        beforeSend: function () { null; }, 
        error : function(error){ 
            $('#btn_enviar').css("visibility","visible");
        }
    });
}

function modificarCss(){
    var altura = $(window).height();
    //Para Ipad 1024
    if(altura>1010){
        //alert(0);
     
        $('.fixed-footer').css("height","7%");
        $('.fixed-footer').css("min-height","7%");
        $('#btn_iniciar').css("width","15%");
        $('#btn_enviar').css("width","12%");
        $('#btn_registrar').css("width","15%");
        $('#btn_guardar_pro_completo').css("width","15%");
        $('#btn_guardar_pro_fecha').css("width","15%");
        $('#btn_cerrar_sesion').css("width","15%");
        $('#btn_guardar').css("width","15%");
        $('.label_nueva').css("margin-top","25%");
        


        $('.bases_leg p').css("font-size","1.8rem");

        $('.contenedor-equipos ul li').css("margin-top","5px");
        $('.contenedor-equipos ul li').css("margin-bottom","5px");
        $('.contenedor-equipos ul li').css("padding","10%");
        $('.contenedor-equipos ul li span').css("font-size","1.4rem");
    }
}