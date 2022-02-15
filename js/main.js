$(document).ready(function(){

    const cityNm= []; //버튼 클릭 또는 검색바에서 입력을 하는 순간, 도시명 데이터를 수집한다.
    console.log(cityNm);


    let state_icon = ""; //텍스트 아이콘을 이미지 아이콘으로 변경하는 데이터

    const w_box = `
    <li>
        <div class="top">
            <div class="cur_icon">
                <i class="wi "></i>
            </div>
            <div class="info">
                <p class="temp"><span class="degree">12</span>&nbsp; ℃</p>
                <p class="interTemp">
                    최저 <span class="minTemp">9</span>℃ /
                    최고 <span class="maxTemp">15</span>℃
                </p>
                <h4>Snow</h4>
                <p class="location"><span class="city">Busan</span>, <span class="nation">KR</span></p>
            </div>
        </div>
        <div class="bottom">
            <div class="wind">
                <i class="wi wi-strong-wind"></i>
                <p><span>0.00</span>&nbsp;m/s</p>
            </div>
            <div class="humidity">
                <i class="wi wi-humidity"></i>
                <p><span>00</span>&nbsp;%</p>
            </div>
            <div class="cloud">
                <i class="wi wi-cloudy"></i>
                <p><span>0.00</span>&nbsp;%</p>
            </div>
        </div>
    </li>
    `;


    function w_info(){
        $("#weather ul").empty(); // empty: 하위의 요소, 내용들을 비운다.

        // cityNm 이라는 배열 데이터를 기준으로 반복하여 구조(w_box)를 넣는다.
        for(v of cityNm){
            $("#weather ul").append(w_box);
        }
        // 첫번째 데이터가 존재한다면 두번째 버튼을 클릭했을 때, 두번을 반복 한다. (기존 데이터인 한개의 박스가 있는것에 추가로 두개의 박스가 추가된다.)
        // 구성 완료된 시점


        $("#weather li").each(function(index){
            // index : 순차적 접근 과정에서 인덱스번호를 

            $.ajax({
                url : `https://api.openweathermap.org/data/2.5/weather?q=${cityNm[index]}&appid=b1095e725c3b8f639dd108daa43ac5c9`,
                dataType : "json",
                success : function(data){
                    // console.log(data);

                    // 날씨
                    const weather = data.weather[0].main;
                    console.log(`현재 날씨 : ${weather}`);

                    // 화씨 계산 :	[°C] = [K] − 273.15
                    // 현재 온도
                    const temp = Math.round(data.main.temp - 273.15);
                    console.log(`현재 온도 : ${temp}`);
                    // 최저 온도
                    const minTemp = Math.round(data.main.temp_min - 273.15);
                    console.log(`최저 온도 : ${minTemp}`);
                    // 최고 온도
                    const maxTemp = Math.round(data.main.temp_max - 273.15);
                    console.log(`최고 온도 : ${maxTemp}`);

                    // 도시명
                    const city = data.name;
                    console.log(`도시명 : ${city}`);
                    // 국가명
                    const nation = data.sys.country;
                    console.log(`국가명 : ${nation}`);

                    // 풍속
                    const wind = data.wind.speed;
                    console.log(`현재 풍속 : ${wind}`);
                    // 습도
                    const humidity = data.main.humidity;
                    console.log(`현재 습도 : ${humidity}`);
                    // 구름양
                    const cloud = data.clouds.all;
                    console.log(`구름 양 : ${cloud}`);



                    // 텍스트화된 날씨(변수명 : weather) 데이터를 이미지 아이콘으로 변경 
                    // 중괄호 빼는 이유는 실행문 내부에 들어가는게 한문장뿐이라서
                    if(weather == "Clear") state_icon = "wi-day-sunny";
                    else if(weather == "Clouds") state_icon = "wi-cloud";
                    else if(weather == "Rain") state_icon="wi-rain";
                    else if(weather == "Snow") state_icon="wi-snow";
                    else if(weather == "Mist") state_icon="wi-fog";
                    // 추가할 날씨는 더 추가해야함


                    $("#weather li").eq(index).find(".cur_icon i").addClass(state_icon);
                    $("#weather li").eq(index).find(".temp .degree").text(temp);
                    $("#weather li").eq(index).find(".minTemp").text(minTemp);
                    $("#weather li").eq(index).find(".maxTemp").text(maxTemp);
                    $("#weather li").eq(index).find(".info h4").text(weather);
                    $("#weather li").eq(index).find(".info .city").text(city);
                    $("#weather li").eq(index).find(".info .nation").text(nation);
                    $("#weather li").eq(index).find(".bottom .wind span").text(wind);
                    $("#weather li").eq(index).find(".bottom .humidity span").text(humidity);
                    $("#weather li").eq(index).find(".bottom .cloud span").text(cloud);
                }

            }); // ajax 종료
        }); //each문 종료
    }
    $(document).on("click", ".cities button", function(){
        const city_txt = $(this).text();
        console.log(city_txt);
        cityNm.unshift(city_txt);
        console.log(cityNm);
        $(this).remove();
        // $(this).css("background-color", "#2d8fd5").css("color", "#fff");

        w_info(); //함수 호출
    });

    function searching(){
        const search_val = $("#search_box").val();
        if(search_val.trim() == ""){ //검색어의 공백을 제거해보니 값이 없다면(= 공백만 넣은 상태)
            alert("검색어가 없습니다. 입력해주세요.");
            $("#search_box").focus();
        }else{
            cityNm.unshift(search_val);
            w_info();
        }
    }

    $(".search button").click(function(){
        searching();
    });

    $(".search").keydown(function(e){
        if(e.keyCode == "13"){
            searching();
        }
    });



    navigator.geolocation.getCurrentPosition((position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude); //위도
        console.log(longitude); //경도(동경 135도)

        $.ajax({
            url : `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b1095e725c3b8f639dd108daa43ac5c9`,
            dataType : "json",
            success : function(data){
                // console.log(data);

                // 도시명
                const city = data.name;
                console.log(`도시명 : ${city}`);
                // 국가명
                const nation = data.sys.country;
                console.log(`국가명 : ${nation}`);

                cityNm.unshift(city);
                w_info();


            }

        }); // ajax 종료
      });
});