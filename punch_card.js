/**
 * Author: Slabkiy Andrey
 *
 */



'use strict';
window.addEventListener('resize', () => {
    if( document.getElementById('c_pc') !== undefined ){
        document.getElementById('c_pc').remove()
    }
    if( document.getElementById('c_pp') !== undefined ){
        document.getElementById('c_pp').remove()
    }
    punch_card.create();
});
class PunchCard {
    constructor( settings ){
        this.where = settings.where;
        this.what = settings.what;
        this.height = settings.height;
        this.label = settings.label;
        this.color = settings.color;
    }
    create(){
        var circle_data = [];

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
        var color = this.color;
        var min_radius = 2;
        var chart = canv_punch.getContext('2d');
        var popup_c = canv_popup.getContext('2d');
        var label = this.label;
        draw_punch_card();
        punch_card.onmousemove = function(e){

            popup_c.clearRect(0,0, canv_popup.width, canv_popup.height);
           for( var i = 0; i < circle_data.length; i++ ){

              if( e.layerX >= circle_data[i].x-max_radius && e.layerX <= circle_data[i].x+max_radius && e.layerY >= circle_data[i].y-max_radius && e.layerY <= circle_data[i].y+max_radius ){

                  popup_c.beginPath();
                  popup_c.fillStyle = 'rgba( 227, 242, 253, 0.6 )';
                  popup_c.fillRect(0, circle_data[i].y-(padding_y/2), x+max_radius, padding_y);
                  popup_c.fillStyle = 'rgba( 96, 125, 139, 0.8 )';
                  popup_c.arc( circle_data[i].x, circle_data[i].y, max_radius-5, 0, 2 * Math.PI, false );
                  popup_c.fill();
                  popup_c.font = "9px verdana, 'sans-serif'";
                  popup_c.fillStyle = 'rgb(255, 255, 255)';
                  switch (circle_data[i].text.toString().length) {
                    case 1:
                        popup_c.fillText(circle_data[i].text, circle_data[i].x-(max_radius/6), circle_data[i].y+3);
                      break;
                    case 2:
                        popup_c.fillText(circle_data[i].text, circle_data[i].x-(max_radius/3.5), circle_data[i].y+3);
                      break;
                    case 3:
                        popup_c.fillText(circle_data[i].text, circle_data[i].x-(max_radius/2), circle_data[i].y+3);
                      break;
                    case 4:
                        popup_c.fillText(circle_data[i].text, circle_data[i].x-(max_radius/1.5), circle_data[i].y+3);
                      break;
                    default:
                      popup_c.fillText(circle_data[i].text, circle_data[i].x-(max_radius/1.3), circle_data[i].y+3);

                  }

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
                            chart.font = "9px verdana, 'sans-serif'";
                            chart.fillText(j+'ч' ,padding_start_x+padding_x*(j+1), padding_y*(i)+9);

                        }
                        chart.beginPath();
                        chart.moveTo(padding_start_x+padding_x*(j+1), padding_y*(i));
                        chart.lineWidth = 0.1;
                        chart.lineTo(padding_start_x+padding_x*(j+1), padding_y*(i)-6);
                        chart.strokeStyle = "rgb(63 , 81, 181)";
                        chart.stroke();
                        chart.closePath();

                    }

                        chart.beginPath();
                        chart.moveTo(0, padding_y*(i));
                        chart.font = "12px verdana, 'sans-serif'";
                        chart.fillStyle = "rgb(44, 62, 80)";
                        chart.fillText(label[i-1], 0, padding_y*(i)-(padding_y/2.5));
                        chart.lineWidth = 0.1;
                        chart.lineTo(x+max_radius, padding_y*(i));
                        chart.strokeStyle = "rgba(63 , 81, 181)";
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
                            chart.fillStyle = color;
                            chart.strokeStyle = color;
                            chart.fill();
                            chart.stroke();
                            var obj = {
                                'x' : padding_start_x+padding_x*(j+1),
                                'y' : padding_y*(i)-(padding_y/2),
                                'text': result_array[i][j],
                                'radius': set_radius(result_array[i][j])
                            }
                            circle_data.push(obj);
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
