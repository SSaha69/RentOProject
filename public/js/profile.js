
          $(document).ready(function(){
                $('#form1').hide();
                $('#btn4').click(function(){
                    $('#form1').show();
                    $('#btn4').hide();
                })
                
                
                $('#txtBox1').hide();
              $('#output1').hide();
              
                
              $('#btn1').click(function(){
             $('#text1').hide();
             $('#txtBox1').show();
             $('#output1').show();
             $('#btn1').hide();
            });
            
            $("#output1").click(function(){
            $('#text1').show();
            $('#txtBox1').hide();
             $('#output1').hide();
             $('#btn1').show();
               
            });
            
            
            
            $('#txtBox2').hide();
              $('#output2').hide();
              
            $('#btn2').click(function(){
             $('#text2').hide();
             $('#txtBox2').show();
             $('#output2').show();
             $('#btn2').hide();
            });
            
            $("#output2").click(function(){
            $('#text2').show();
            $('#txtBox2').hide();
             $('#output2').hide();
             $('#btn2').show();
               
            });
            
            
             $('#txtBox3').hide();
              $('#output3').hide();
              
            $('#btn3').click(function(){
             $('#text3').hide();
             $('#txtBox3').show();
             $('#output3').show();
             $('#btn3').hide();
            });
            
            $("#output3").click(function(){
            $('#text3').show();
            $('#txtBox3').hide();
             $('#output3').hide();
             $('#btn3').show();
               
            });
            
            $("#sub").hide();
            $(".rad").click(function(){
                $("#sub").click();
            })
            
        });