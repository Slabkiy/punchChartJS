/**
 * Author: Slabkiy Andrey
 *
 */




window.addEventListener('resize', () => {
    if( document.getElementById('c_pc') !== undefined ){
        document.getElementById('c_pc').remove()
    }
    if( document.getElementById('c_pp') !== undefined ){
        document.getElementById('c_pp').remove()
    }
    punch_card.create();
});
'use strict';
class PunchCard {
    constructor( settings ){
        this.where = settings.where;
        this.what = settings.what;
        this.height = settings.height;
    }
    create(){
        var circle_position = [];

        /*Создаем канвасы*/

        var punch_card = document.getElementById(this.where);
        var canv_punch  = document.createElement('canvas');
        canv_punch.width = punch_card.clientWidth;
        canv_punch.height = this.height;
        canv_punch.id = 'c_pc';
        canv_punch.style.cssText = "position: absolute; z-index: 10";
        punch_card.appendChild(canv_punch);
        var canv_popup  = document.createElement('canvas');
        canv_popup.width = punch_card.clientWidth;
        canv_popup.height = this.height;
        canv_popup.id = 'c_pp';
        canv_popup.style.cssText = "position: absolute; z-index: 100";
        punch_card.appendChild(canv_popup);
        /*Создаем канвасы*/
        var result_array = this.what;
        /*Задаем значение x и y*/
        var x = (canv_punch.width-30);
        var y = (canv_punch.height-10);
        /*Задаем значение x и y*/
        var padding_start_x = 100;
        var padding_y = (y/Object.keys(result_array).length);
        var padding_x = (x-padding_start_x)/result_array[1].length;
        if( padding_y < padding_x ){
            var max_radius = parseInt((padding_y-8)/2);
        }else{
            var max_radius = parseInt((padding_x-8)/2);
        }

        var min_radius = 2;
        var chart = canv_punch.getContext('2d');
        var popup_c = canv_popup.getContext('2d');
        var label = [ 'Понедельник', "Вторник", "Среда" ,"Четверг", "Пятница", "Суббота", 'Воскресенье'];
        draw_punch_card();
        punch_card.onmousemove = function(e){

            popup_c.clearRect(0,0, canv_popup.width, canv_popup.height);
           for( var i = 0; i < circle_position.length; i++ ){

              if( e.layerX >= circle_position[i].x-max_radius && e.layerX <= circle_position[i].x+max_radius && e.layerY >= circle_position[i].y-max_radius && e.layerY <= circle_position[i].y+max_radius ){

                  popup_c.beginPath();
                  popup_c.fillStyle = 'rgba( 78, 205, 196, 0.4 )';
                  popup_c.fillRect(0, circle_position[i].y-(padding_y/2), x, padding_y);
                  popup_c.font = "9px halflings, 'sans-serif'";
                  popup_c.fillStyle = 'rgb(44, 62, 80)';
                  popup_c.fillText(circle_position[i].text, circle_position[i].x-(max_radius/2), circle_position[i].y-( padding_y/3 ));

              }

           }

        }

        function draw_punch_card(){

            draw_field();
            draw_circle();
            function draw_field(){

                Object.keys(result_array).forEach(function(i,counter) {

                    for( var j = 0; j < result_array[i].length; j++ ){
                        if( i == Object.keys(result_array).length){
                            chart.font = "9px halflings, 'sans-serif'";
                            chart.fillText(j+'ч' ,padding_start_x+padding_x*(j+1), padding_y*(i)+9);

                        }
                        chart.beginPath();
                        chart.moveTo(padding_start_x+padding_x*(j+1), padding_y*(i));
                        chart.lineWidth = 0.5;
                        chart.lineTo(padding_start_x+padding_x*(j+1), padding_y*(i)-6);
                        chart.strokeStyle = "rgb(108 , 122, 137)";
                        chart.stroke();
                        chart.closePath();

                    }

                        chart.beginPath();
                        chart.moveTo(0, padding_y*(i));
                        chart.font = "12px halflings, 'sans-serif'";
                        chart.fillStyle = "rgb(44, 62, 80)";
                        chart.fillText(label[i-1], 0, padding_y*(i)-(padding_y/2.5));
                        chart.lineWidth = 0.5;
                        chart.lineTo(x, padding_y*(i));
                        chart.strokeStyle = "rgba(108 , 122, 137)";
                        chart.stroke();
                        chart.closePath();

                });

            }
            function draw_circle(){

                 Object.keys(result_array).forEach(function(i,counter) {
                      for( var j = 0; j < result_array[i].length; j++ ){
                          if( result_array[i][j] != 0  ){

                            chart.beginPath();
                            chart.arc( padding_start_x+padding_x*(j+1), padding_y*(i)-(padding_y/2), set_radius(result_array[i][j]), 0, 2*Math.PI, false);
                            chart.fillStyle = "rgb(0," + Math.floor(255-35.5*i)+","+Math.floor(255-10.5*j)+")"; // сделать цвет в зависиости от количества действий
                            chart.strokeStyle = "rgb(0," + Math.floor(255-35.5*i)+","+Math.floor(255-10.5*j)+")"; //
                            chart.fill();
                            chart.stroke();
                            var obj = {
                                'x' : padding_start_x+padding_x*(j+1),
                                'y' : padding_y*(i)-(padding_y/2),
                                'text': result_array[i][j]
                            }
                            circle_position.push(obj);
                        }
                    }

                 });

            }
            function set_radius(value){
                var max_value = 0;
                var count_radius = max_radius/min_radius;
                for( var i = Object.keys(result_array)[0]; i < Object.keys(result_array).length; i++ ){
                    if( max_value <  Math.max.apply(Math, result_array[i])){

                        max_value = Math.max.apply(Math, result_array[i]);

                    }

                }
                var step = max_value/count_radius;
                for ( var i = 0; i < count_radius; i++){
                    if( value >= i*step && value <= (i+1)*step ){

                        return (i+1)*2;

                    }
                }
            }
        }
    }
}
