// The simulation layer: weather, the world clock, damage resolution, and the
// recurring tick that drives everything else. `ontick()` advances game time and
// is the entry point for all periodic world behaviour; the loop that calls it
// lives at the bottom of this file.

function wManager() {
  const ses = getSeason();
  if (w_manager.duration > 0) w_manager.duration -= global.timescale;
  else {
    const chance = rand(1, 100);
    switch (ses) {
      case 1:
        switch (w_manager.curr.id) {
          case weather.sunny.id:
            if (chance <= 10) setWeather(weather.cloudy, rand(120, 220));
            else if (chance > 10 && chance <= 20)
              setWeather(weather.overcast, rand(90, 280));
            else if (
              chance > 20 &&
              chance <= 90 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(300, 500));
            else if (
              chance > 20 &&
              chance <= 90 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(200, 400));
            else setWeather(weather.sunny, rand(22, 44));
            break;
          case weather.cloudy.id:
            if (chance <= 15) setWeather(weather.stormy, rand(100, 200));
            else if (chance > 15 && chance <= 35)
              setWeather(weather.overcast, rand(90, 220));
            else if (chance > 35 && chance <= 45)
              setWeather(weather.rain, rand(150, 250));
            else if (chance > 45 && chance <= 65)
              setWeather(weather.drizzle, rand(30, 80));
            else if (
              chance > 65 &&
              chance <= 80 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(300, 500));
            else if (
              chance > 65 &&
              chance <= 80 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(200, 400));
            else setWeather(weather.cloudy, rand(90, 160));
            break;
          case weather.stormy.id:
            if (chance < 10) setWeather(weather.cloudy, rand(90, 120));
            else if (chance > 10 && chance <= 40)
              setWeather(weather.storm, rand(90, 160));
            else if (chance > 40 && chance <= 60)
              setWeather(weather.rain, rand(120, 200));
            else if (chance > 60 && chance <= 75)
              setWeather(weather.drizzle, rand(20, 40));
            else setWeather(weather.stormy, rand(60, 120));
            break;
          case weather.storm.id:
            if (chance < 5) setWeather(weather.stormy, rand(80, 120));
            else if (chance > 5 && chance <= 65)
              setWeather(weather.rain, rand(180, 250));
            else if (chance > 65 && chance <= 75)
              setWeather(weather.heavyrain, rand(80, 150));
            else setWeather(weather.storm, rand(20, 80));
            break;
          case weather.overcast.id:
            if (chance < 20) setWeather(weather.stormy, rand(50, 120));
            else if (chance > 20 && chance <= 45)
              setWeather(weather.cloudy, rand(100, 200));
            else if (chance > 45 && chance <= 60)
              setWeather(weather.clear, rand(150, 250));
            else setWeather(weather.overcast, rand(40, 90));
            break;
          case weather.rain.id:
            if (chance < 10) setWeather(weather.drizzle, rand(30, 50));
            else if (chance > 10 && chance <= 20)
              setWeather(weather.heavyrain, rand(100, 200));
            else if (chance > 20 && chance <= 30)
              setWeather(weather.overcast, rand(52, 173));
            else if (chance > 30 && chance <= 55)
              setWeather(weather.misty, rand(25, 55));
            else if (chance > 55 && chance <= 80)
              setWeather(weather.clear, rand(225, 455));
            else setWeather(weather.rain, rand(80, 120));
            break;
          case weather.heavyrain.id:
            if (chance < 10) setWeather(weather.storm, rand(80, 130));
            else if (chance > 10 && chance <= 65)
              setWeather(weather.rain, rand(100, 170));
            else if (chance > 65 && chance <= 75)
              setWeather(weather.misty, rand(15, 40));
            else if (chance > 75 && chance <= 80)
              setWeather(weather.clear, rand(110, 200));
            else if (chance > 80 && chance <= 90)
              setWeather(weather.thunder, rand(120, 200));
            else setWeather(weather.heavyrain, rand(50, 100));
            break;
          case weather.misty.id:
            if (chance < 50) setWeather(weather.foggy, rand(22, 33));
            else if (
              chance > 50 &&
              chance <= 80 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 50 &&
              chance <= 80 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.misty, rand(11, 22));
            break;
          case weather.foggy.id:
            if (chance < 20) setWeather(weather.overcast, rand(80, 130));
            else if (
              chance > 20 &&
              chance <= 70 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 20 &&
              chance <= 70 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.foggy, rand(11, 22));
            break;
          case weather.drizzle.id:
            if (chance < 20) setWeather(weather.overcast, rand(30, 60));
            else if (chance > 20 && chance <= 50)
              setWeather(weather.rain, rand(90, 180));
            else if (chance > 50 && chance <= 65)
              setWeather(weather.clear, rand(90, 180));
            else setWeather(weather.drizzle, rand(30, 62));
            break;
          case weather.clear.id:
            if (chance < 10) setWeather(weather.overcast, rand(30, 60));
            else if (
              chance > 10 &&
              chance <= 55 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 10 &&
              chance <= 55 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else if (chance > 55 && chance <= 65)
              setWeather(weather.cloudy, rand(100, 200));
            else setWeather(weather.clear, rand(160, 290));
            break;
          case weather.thunder.id:
            if (chance < 50) setWeather(weather.heavyrain, rand(60, 90));
            else if (chance > 50 && chance <= 80)
              setWeather(weather.storm, rand(80, 120));
            else setWeather(weather.thunder, rand(40, 60));
            break;
          default:
            setWeather(weather.clear, rand(30, 60));
            break;
        }
        break;
      case 2:
        switch (w_manager.curr.id) {
          case weather.sunny.id:
            if (chance <= 5) setWeather(weather.cloudy, rand(60, 120));
            else if (
              chance > 5 &&
              chance <= 90 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(400, 700));
            else if (
              chance > 15 &&
              chance <= 90 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(300, 500));
            else setWeather(weather.sunny, rand(90, 180));
            break;
          case weather.cloudy.id:
            if (chance <= 3) setWeather(weather.stormy, rand(30, 60));
            else if (chance > 3 && chance <= 8)
              setWeather(weather.overcast, rand(40, 120));
            else if (chance > 8 && chance <= 15)
              setWeather(weather.rain, rand(50, 100));
            else if (chance > 15 && chance <= 25)
              setWeather(weather.drizzle, rand(30, 80));
            else if (
              chance > 25 &&
              chance <= 80 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(300, 500));
            else if (
              chance > 25 &&
              chance <= 80 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(200, 400));
            else setWeather(weather.cloudy, rand(40, 120));
            break;
          case weather.stormy.id:
            if (chance < 35) setWeather(weather.cloudy, rand(60, 120));
            else if (chance > 35 && chance <= 40)
              setWeather(weather.storm, rand(90, 160));
            else if (chance > 40 && chance <= 60)
              setWeather(weather.rain, rand(70, 120));
            else if (chance > 60 && chance <= 85)
              setWeather(weather.drizzle, rand(60, 900));
            else setWeather(weather.stormy, rand(60, 120));
            break;
          case weather.storm.id:
            if (chance < 5) setWeather(weather.stormy, rand(30, 50));
            else if (chance > 5 && chance <= 65)
              setWeather(weather.rain, rand(140, 200));
            else if (chance > 65 && chance <= 70)
              setWeather(weather.heavyrain, rand(80, 150));
            else setWeather(weather.storm, rand(20, 80));
            break;
          case weather.overcast.id:
            if (chance < 5) setWeather(weather.stormy, rand(20, 60));
            else if (chance > 5 && chance <= 45)
              setWeather(weather.cloudy, rand(100, 200));
            else if (chance > 45 && chance <= 65)
              setWeather(weather.clear, rand(150, 250));
            else setWeather(weather.overcast, rand(60, 110));
            break;
          case weather.rain.id:
            if (chance < 10) setWeather(weather.drizzle, rand(50, 70));
            else if (chance > 10 && chance <= 15)
              setWeather(weather.heavyrain, rand(50, 80));
            else if (chance > 15 && chance <= 40)
              setWeather(weather.overcast, rand(82, 173));
            else if (chance > 40 && chance <= 55)
              setWeather(weather.misty, rand(25, 55));
            else if (chance > 55 && chance <= 80)
              setWeather(weather.clear, rand(225, 455));
            else setWeather(weather.rain, rand(80, 120));
            break;
          case weather.heavyrain.id:
            if (chance < 10) setWeather(weather.storm, rand(80, 130));
            else if (chance > 10 && chance <= 65)
              setWeather(weather.rain, rand(100, 170));
            else if (chance > 65 && chance <= 75)
              setWeather(weather.misty, rand(15, 40));
            else if (chance > 75 && chance <= 87)
              setWeather(weather.clear, rand(110, 200));
            else if (chance > 87 && chance <= 90)
              setWeather(weather.thunder, rand(120, 200));
            else setWeather(weather.heavyrain, rand(50, 100));
            break;
          case weather.misty.id:
            if (chance < 50) setWeather(weather.foggy, rand(22, 33));
            else if (
              chance > 50 &&
              chance <= 80 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 50 &&
              chance <= 80 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.misty, rand(11, 22));
            break;
          case weather.foggy.id:
            if (chance < 20) setWeather(weather.overcast, rand(80, 130));
            else if (
              chance > 20 &&
              chance <= 70 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 20 &&
              chance <= 70 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.foggy, rand(11, 22));
            break;
          case weather.drizzle.id:
            if (chance < 15) setWeather(weather.overcast, rand(30, 60));
            else if (chance > 15 && chance <= 40)
              setWeather(weather.cloudy, rand(90, 180));
            else if (chance > 40 && chance <= 50)
              setWeather(weather.rain, rand(50, 111));
            else if (chance > 50 && chance <= 65)
              setWeather(weather.clear, rand(90, 180));
            else setWeather(weather.drizzle, rand(30, 62));
            break;
          case weather.clear.id:
            if (chance < 5) setWeather(weather.overcast, rand(30, 60));
            else if (
              chance > 5 &&
              chance <= 55 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 10 &&
              chance <= 55 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else if (chance > 55 && chance <= 65)
              setWeather(weather.cloudy, rand(100, 200));
            else setWeather(weather.clear, rand(160, 290));
            break;
          case weather.thunder.id:
            if (chance < 50) setWeather(weather.heavyrain, rand(60, 90));
            else if (chance > 50 && chance <= 80)
              setWeather(weather.storm, rand(80, 120));
            else setWeather(weather.thunder, rand(40, 60));
            break;
          default:
            setWeather(weather.clear, rand(30, 60));
            break;
        }
        break;
      case 3:
        switch (w_manager.curr.id) {
          case weather.sunny.id:
            if (chance <= 25) setWeather(weather.cloudy, rand(120, 220));
            else if (chance > 25 && chance <= 60)
              setWeather(weather.overcast, rand(90, 280));
            else if (
              chance > 60 &&
              chance <= 90 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(80, 150));
            else if (
              chance > 60 &&
              chance <= 90 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(120, 180));
            else setWeather(weather.sunny, rand(22, 44));
            break;
          case weather.cloudy.id:
            if (chance <= 30) setWeather(weather.stormy, rand(100, 200));
            else if (chance > 30 && chance <= 55)
              setWeather(weather.overcast, rand(90, 220));
            else if (chance > 55 && chance <= 85)
              setWeather(weather.rain, rand(150, 250));
            else if (chance > 85 && chance <= 90)
              setWeather(weather.drizzle, rand(70, 120));
            else if (
              chance > 90 &&
              chance <= 95 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(170, 250));
            else if (
              chance > 90 &&
              chance <= 95 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(180, 300));
            else setWeather(weather.cloudy, rand(90, 160));
            break;
          case weather.stormy.id:
            if (chance < 15) setWeather(weather.cloudy, rand(90, 120));
            else if (chance > 15 && chance <= 40)
              setWeather(weather.storm, rand(90, 160));
            else if (chance > 40 && chance <= 70)
              setWeather(weather.rain, rand(120, 200));
            else if (chance > 70 && chance <= 85)
              setWeather(weather.drizzle, rand(20, 40));
            else setWeather(weather.stormy, rand(60, 120));
            break;
          case weather.storm.id:
            if (chance < 10) setWeather(weather.stormy, rand(80, 120));
            else if (chance > 10 && chance <= 45)
              setWeather(weather.rain, rand(180, 250));
            else if (chance > 45 && chance <= 85)
              setWeather(weather.heavyrain, rand(100, 190));
            else setWeather(weather.storm, rand(20, 80));
            break;
          case weather.overcast.id:
            if (chance < 20) setWeather(weather.stormy, rand(50, 120));
            else if (chance > 20 && chance <= 55)
              setWeather(weather.cloudy, rand(80, 150));
            else if (chance > 55 && chance <= 60)
              setWeather(weather.clear, rand(150, 250));
            else setWeather(weather.overcast, rand(40, 90));
            break;
          case weather.rain.id:
            if (chance < 10) setWeather(weather.drizzle, rand(30, 50));
            else if (chance > 10 && chance <= 30)
              setWeather(weather.heavyrain, rand(100, 200));
            else if (chance > 30 && chance <= 40)
              setWeather(weather.overcast, rand(52, 173));
            else if (chance > 40 && chance <= 50)
              setWeather(weather.misty, rand(25, 55));
            else if (chance > 50 && chance <= 65)
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.rain, rand(80, 120));
            break;
          case weather.heavyrain.id:
            if (chance < 15) setWeather(weather.storm, rand(80, 130));
            else if (chance > 15 && chance <= 55)
              setWeather(weather.rain, rand(100, 170));
            else if (chance > 55 && chance <= 65)
              setWeather(weather.misty, rand(15, 40));
            else if (chance > 65 && chance <= 70)
              setWeather(weather.clear, rand(110, 200));
            else if (chance > 70 && chance <= 95)
              setWeather(weather.thunder, rand(120, 200));
            else setWeather(weather.heavyrain, rand(50, 100));
            break;
          case weather.misty.id:
            if (chance < 25) setWeather(weather.foggy, rand(22, 33));
            else if (chance > 25 && chance <= 55)
              setWeather(weather.overcast, rand(60, 100));
            else if (chance > 55 && chance <= 75)
              setWeather(weather.cloudy, rand(60, 100));
            else setWeather(weather.misty, rand(11, 22));
            break;
          case weather.foggy.id:
            if (chance < 20) setWeather(weather.overcast, rand(80, 130));
            else if (chance > 20 && chance <= 40)
              setWeather(weather.rain, rand(100, 200));
            else if (chance > 40 && chance <= 70)
              setWeather(weather.heavyrain, rand(100, 200));
            else setWeather(weather.foggy, rand(11, 22));
            break;
          case weather.drizzle.id:
            if (chance < 15) setWeather(weather.overcast, rand(30, 60));
            else if (chance > 15 && chance <= 55)
              setWeather(weather.rain, rand(90, 180));
            else if (chance > 55 && chance <= 60)
              setWeather(weather.clear, rand(60, 100));
            else if (chance > 60 && chance <= 70)
              setWeather(weather.cloudy, rand(40, 90));
            else setWeather(weather.drizzle, rand(30, 62));
            break;
          case weather.clear.id:
            if (chance < 25) setWeather(weather.overcast, rand(80, 140));
            else if (
              chance > 25 &&
              chance <= 45 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 25 &&
              chance <= 45 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else if (chance > 45 && chance <= 70)
              setWeather(weather.cloudy, rand(100, 200));
            else if (chance > 70 && chance <= 90)
              setWeather(weather.drizzle, rand(30, 80));
            else setWeather(weather.clear, rand(120, 200));
            break;
          case weather.thunder.id:
            if (chance < 30) setWeather(weather.heavyrain, rand(60, 90));
            else if (chance > 30 && chance <= 60)
              setWeather(weather.storm, rand(80, 120));
            else setWeather(weather.thunder, rand(40, 60));
            break;
          default:
            setWeather(weather.clear, rand(30, 60));
            break;
        }
        break;
      case 4:
        switch (w_manager.curr.id) {
          case weather.sunny.id:
            if (chance <= 40) setWeather(weather.cloudy, rand(120, 220));
            else if (chance > 40 && chance <= 80)
              setWeather(weather.overcast, rand(90, 280));
            else if (
              chance > 80 &&
              chance <= 90 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 300));
            else if (
              chance > 80 &&
              chance <= 90 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 300));
            else setWeather(weather.sunny, rand(22, 44));
            break;
          case weather.cloudy.id:
            if (chance <= 15) setWeather(weather.overcast, rand(90, 220));
            else if (chance > 15 && chance <= 17)
              setWeather(weather.rain, rand(30, 80));
            else if (chance > 17 && chance <= 20)
              setWeather(weather.drizzle, rand(30, 80));
            else if (
              chance > 20 &&
              chance <= 30 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 300));
            else if (
              chance > 20 &&
              chance <= 30 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 300));
            else if (chance > 30 && chance <= 60)
              setWeather(weather.snow, rand(180, 300));
            else if (chance > 60 && chance <= 70)
              setWeather(weather.sstorm, rand(90, 200));
            else setWeather(weather.cloudy, rand(90, 160));
            break;
          case weather.overcast.id:
            if (chance < 20) setWeather(weather.snow, rand(50, 120));
            else if (chance > 20 && chance <= 45)
              setWeather(weather.cloudy, rand(100, 200));
            else if (chance > 45 && chance <= 60)
              setWeather(weather.clear, rand(150, 250));
            else if (chance > 60 && chance <= 70)
              setWeather(weather.sstorm, rand(150, 250));
            else setWeather(weather.overcast, rand(40, 90));
            break;
          case weather.rain.id:
            if (chance < 10) setWeather(weather.drizzle, rand(30, 50));
            else if (chance > 10 && chance <= 20)
              setWeather(weather.snow, rand(100, 200));
            else if (chance > 20 && chance <= 30)
              setWeather(weather.overcast, rand(52, 173));
            else if (chance > 30 && chance <= 55)
              setWeather(weather.misty, rand(25, 55));
            else if (chance > 55 && chance <= 80)
              setWeather(weather.clear, rand(225, 455));
            else setWeather(weather.rain, rand(20, 40));
            break;
          case weather.misty.id:
            if (chance < 30) setWeather(weather.foggy, rand(22, 33));
            else if (chance > 30 && chance <= 50)
              setWeather(weather.snow, rand(100, 200));
            else if (
              chance > 50 &&
              chance <= 80 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 50 &&
              chance <= 80 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.misty, rand(11, 22));
            break;
          case weather.foggy.id:
            if (chance < 20) setWeather(weather.overcast, rand(80, 130));
            else if (
              chance > 20 &&
              chance <= 70 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 20 &&
              chance <= 70 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else setWeather(weather.foggy, rand(11, 22));
            break;
          case weather.drizzle.id:
            if (chance < 20) setWeather(weather.overcast, rand(30, 60));
            else if (chance > 20 && chance <= 25)
              setWeather(weather.rain, rand(90, 120));
            else if (chance > 25 && chance <= 40)
              setWeather(weather.snow, rand(90, 180));
            else if (chance > 40 && chance <= 65)
              setWeather(weather.clear, rand(90, 150));
            else setWeather(weather.drizzle, rand(30, 62));
            break;
          case weather.clear.id:
            if (chance < 10) setWeather(weather.overcast, rand(30, 60));
            else if (
              chance > 10 &&
              chance <= 55 &&
              getHour() >= 5 &&
              getHour() <= 16
            )
              setWeather(weather.sunny, rand(100, 200));
            else if (
              chance > 10 &&
              chance <= 55 &&
              getHour() < 5 &&
              getHour() > 16
            )
              setWeather(weather.clear, rand(100, 200));
            else if (chance > 55 && chance <= 65)
              setWeather(weather.cloudy, rand(100, 200));
            else if (chance > 65 && chance <= 75)
              setWeather(weather.snow, rand(100, 200));
            else setWeather(weather.clear, rand(160, 290));
            break;
          case weather.snow.id:
            if (chance < 20) setWeather(weather.sstorm, rand(80, 130));
            else if (chance > 20 && chance <= 25)
              setWeather(weather.rain, rand(15, 50));
            else if (chance > 25 && chance <= 40)
              setWeather(weather.clear, rand(90, 150));
            else if (chance > 40 && chance <= 65)
              setWeather(weather.overcast, rand(140, 320));
            else if (chance > 60 && chance <= 85)
              setWeather(weather.cloudy, rand(120, 200));
            else setWeather(weather.snow, rand(30, 62));
            break;
          case weather.sstorm.id:
            if (chance < 10) setWeather(weather.overcast, rand(30, 60));
            else if (chance > 10 && chance <= 35)
              setWeather(weather.snow, rand(90, 120));
            else if (chance > 35 && chance <= 45)
              setWeather(weather.cloudy, rand(90, 180));
            else if (chance > 45 && chance <= 65)
              setWeather(weather.overcast, rand(90, 150));
            else setWeather(weather.sstorm, rand(40, 120));
            break;
          default:
            setWeather(weather.clear, rand(30, 60));
            break;
        }
        break;
    }
    dom.d_weathert.style.backgroundColor = dom.d_weathert.style.color =
      "inherit";
    dom.d_weathert.innerHTML = w_manager.curr.name;
    dom.d_weathert.style.color = w_manager.curr.c
      ? w_manager.curr.c
      : "inherit";
    dom.d_weathert.style.backgroundColor = w_manager.curr.bc
      ? w_manager.curr.bc
      : "inherit";
    switch (w_manager.curr.id) {
      case weather.sunny.id:
        if (getHour() > 4 && getMinute() >= 30 && getHour() <= 6) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.sunrise_fadf71c7",
          );
          dom.d_weathert.style.color = "#ffef33";
          dom.d_weathert.style.backgroundColor = "#bf495f";
        } else if (getHour() >= 20 && getHour() <= 21) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.dusk_4db13aa0",
          );
          dom.d_weathert.style.color = "yellow";
          dom.d_weathert.style.backgroundColor = "#e8421c";
        } else if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.bright_night_891b0fb5",
          );
          dom.d_weathert.style.color = "cornflowerblue";
          dom.d_weathert.style.backgroundColor = "#1d4677";
        }
        break;
      case weather.cloudy.id:
        if (getHour() > 4 && getMinute() >= 30 && getHour() <= 6) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.sunrise_fadf71c7",
          );
          dom.d_weathert.style.color = "#ffef33";
          dom.d_weathert.style.backgroundColor = "#bf495f";
        } else if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.night_1097b553",
          );
          dom.d_weathert.style.color = "#69e1e6";
          dom.d_weathert.style.backgroundColor = "#091523";
        }
        break;
      case weather.overcast.id:
        if (getHour() >= 18 && getHour() <= 21) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.dusk_4db13aa0",
          );
          dom.d_weathert.style.color = "yellow";
          dom.d_weathert.style.backgroundColor = "#e8421c";
        } else if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.night_1097b553",
          );
          dom.d_weathert.style.color = "#69e1e6";
          dom.d_weathert.style.backgroundColor = "#091523";
        }
        break;
      case weather.rain.id:
        if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.rainy_night_015ecc08",
          );
          dom.d_weathert.style.color = "cyan";
          dom.d_weathert.style.backgroundColor = "#111f63";
        }
        break;
      case weather.misty.id:
        if (getHour() > 4 && getMinute() >= 30 && getHour() <= 6) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.misty_morning_44663fad",
          );
          dom.d_weathert.style.color = "#ffb91d";
          dom.d_weathert.style.backgroundColor = "#926b64";
        } else if (getHour() >= 18 && getHour() <= 21) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.dusk_4db13aa0",
          );
          dom.d_weathert.style.color = "yellow";
          dom.d_weathert.style.backgroundColor = "#e8421c";
        } else if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.misty_night_6e27292a",
          );
          dom.d_weathert.style.color = "#1f69a9";
          dom.d_weathert.style.backgroundColor = "#2c3044";
        }
        break;
      case weather.foggy.id:
        if (getHour() > 4 && getMinute() >= 30 && getHour() <= 6) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.foggy_morning_a3159f83",
          );
          dom.d_weathert.style.color = "#ffc94f";
          dom.d_weathert.style.backgroundColor = "#8e8280";
        } else if (getHour() >= 18 && getHour() <= 21) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.dusk_4db13aa0",
          );
          dom.d_weathert.style.color = "yellow";
          dom.d_weathert.style.backgroundColor = "#e8421c";
        } else if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.foggy_night_ea55cbbc",
          );
          dom.d_weathert.style.color = "#6dbbff";
          dom.d_weathert.style.backgroundColor = "#273267";
        }
        break;
      case weather.drizzle.id:
        if (getHour() >= 22 && getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.night_drizzle_c57a93c7",
          );
          dom.d_weathert.style.color = "cyan";
          dom.d_weathert.style.backgroundColor = "#111f63";
        }
        break;
      case weather.clear.id:
        if (getHour() > 4 && getMinute() >= 30 && getHour() <= 6) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.sunrise_fadf71c7",
          );
          dom.d_weathert.style.color = "#ffef33";
          dom.d_weathert.style.backgroundColor = "#9c3f3f";
        } else if (getHour() >= 20 && getHour() <= 21) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.dusk_4db13aa0",
          );
          dom.d_weathert.style.color = "yellow";
          dom.d_weathert.style.backgroundColor = "#e8421c";
        } else if (getHour() >= 22 || getHour() <= 3) {
          dom.d_weathert.innerHTML = i18n.t(
            "runtime.systems.simulation.interface.starry_night_d8313df3",
          );
          dom.d_weathert.style.color = "#ffff66";
          dom.d_weathert.style.backgroundColor = "#00397b";
        }
        break;
    }
  }
  w_manager.curr.ontick();
  onSeasonTick(ses);
}

function setWeather(w, d) {
  w_manager.curr = w;
  w_manager.duration = d;
  dom.d_weathert.style.backgroundColor = dom.d_weathert.style.color = "inherit";
  dom.d_weathert.innerHTML = w_manager.curr.name;
  //empty(dom.d_weather); icon(dom.d_weather,1,1,32,32)
  if (w.frain === true) {
    global.flags.israin = true;
    global.flags.issnow = false;
    dom.d_anomaly.innerHTML = "🌧";
  } else if (w.fsnow === true) {
    global.flags.issnow = true;
    global.flags.israin = false;
    dom.d_anomaly.innerHTML = "❄️";
  } else {
    global.flags.israin = false;
    dom.d_anomaly.innerHTML = "";
    global.flags.issnow = false;
  }
  if (w.c) dom.d_weathert.style.color = w.c;
  if (w.bc) dom.d_weathert.style.backgroundColor = w.bc;
}
setWeather(weather.clear, 600);

function isWeather(weather) {
  return w_manager.curr.id === weather.id;
}
wManager();
dom.d_time.innerHTML =
  "<small>" + getDay(global.flags.tmmode) + "</small> " + timeDisp(time);

function onSeasonTick(season) {
  switch (season) {
    case 4:
      if (global.stat.wsnrest > 0) {
        global.stat.wsnrest--;
        return;
      }
      if (!global.flags.inside) {
        if (!effect.cold.active) giveEff(you, effect.cold, 5);
        else {
          if (
            w_manager.curr.id === weather.snow.id ||
            w_manager.curr.id === weather.sstorm.id
          ) {
            effect.cold.duration += rand(3, 7);
            giveSkExp(skl.coldr, 0.02);
          } else effect.cold.duration += rand(1, 3);
          if (effect.wet.active) {
            effect.cold.duration += rand(5, 10);
            effect.wet.duration -= 5;
          }
        }
      }
      if (global.stat.wsnburst <= 0) {
        global.stat.wsnburst = rand(200, 1300);
        global.stat.wsnrest = rand(20, 100);
      }
      global.stat.wsnburst--;
      break;
  }
}

function getMinute() {
  return time.minute % 60;
}
function getHour() {
  return time.hour % 24;
}
function getDay(n) {
  return n === 1
    ? global.text.d_l[time.day % 7]
    : n === 2
      ? global.text.d_s[time.day % 7]
      : global.text.d_j[time.day % 7];
}
function isDay(dayIndex) {
  return time.day % 7 === dayIndex;
}
function getMonth() {
  return (time.month % 12) + 1;
}
function getYear() {
  return time.year;
}
function getLunarPhase() {
  return ((time.day % 62.64) / 7.83) << 0;
}
function getSeason(flag) {
  if (getMonth() > 2 && getMonth() <= 5) return !flag ? 1 : "Spring";
  else if (getMonth() > 5 && getMonth() <= 8) return !flag ? 2 : "Summer";
  else if (getMonth() > 8 && getMonth() <= 11) return !flag ? 3 : "Autumn";
  else return !flag ? 4 : "Winter";
}

function timeConv(chrono) {
  chrono.year = (chrono.minute / 518400) << 0;
  chrono.month = (chrono.minute / 43200) << 0;
  chrono.day = (chrono.minute / 1440) << 0;
  chrono.hour = (chrono.minute / 60) << 0;
}

function timeDisp(time, future) {
  let time_t = time;
  if (future) {
    time_t = copy(time);
    time_t.minute += future;
  }
  timeConv(time_t);
  let mm = time_t.minute % 60;
  if (mm < 10) mm = "0" + mm;
  return (
    time_t.year +
    "/" +
    ((time_t.month % 12) + 1) +
    "/" +
    ((time_t.day % 30) + 1) +
    " " +
    (time_t.hour % 24) +
    ":" +
    mm
  );
}

function dropC(crt, t) {
  t = t || 1;
  for (const j in crt.drop)
    if (
      !crt.drop[j].cond ||
      (!!crt.drop[j].cond && crt.drop[j].cond() === true)
    )
      if (
        random() <
        crt.drop[j].chance + (crt.drop[j].chance / 100) * you.luck
      ) {
        giveItem(
          crt.drop[j].item,
          !!crt.drop[j].min ? rand(crt.drop[j].min, crt.drop[j].max) : t,
        );
        if (you.mods.lkdbt > 0 && random() < you.mods.lkdbt)
          giveItem(crt.drop[j].item);
        let d = global.drdata["d" + crt.id];
        if (!d) {
          d = global.drdata["d" + crt.id] = [];
          d[j] = 1;
        } else d[j] = 1;
      }
  for (const jj in global.wdrop)
    if (random() < global.wdrop[jj].c + (global.wdrop[jj].c / 100) * you.luck)
      giveItem(global.wdrop[jj].item, t);
  for (const obj in global.current_z.drop)
    if (
      !global.current_z.drop[obj].cond ||
      (!!global.current_z.drop[obj].cond &&
        global.current_z.drop[obj].cond() === true)
    )
      if (
        random() <
        global.current_z.drop[obj].c +
          (global.current_z.drop[obj].c / 100) * you.luck +
          (global.current_z.drop[obj].c / 75) * skl.hst.lvl
      ) {
        giveItem(global.current_z.drop[obj].item, t);
        giveSkExp(skl.hst, 0.2);
      }
  if (crt.rnk < 22) {
    const ar = ((crt.rnk - 1) / 3) << 0;
    for (const a in global.rdrop[ar])
      if (
        random() <
        global.rdrop[ar][a].c + (global.rdrop[ar][a].c / 100) * you.luck
      )
        giveItem(global.rdrop[ar][a].item, t);
  }
}

function dropread() {
  const t = Object.keys(global.drdata);
  const ids = [];
  for (const a in t) ids[a] = Number(t[a].substring(1));
  for (const a in ids) {
    for (const b in creature) {
      if (ids[a] === creature[b].id) {
        const dt = global.drdata[Object.keys(global.drdata)[a]];
        for (let c = 0; c < dt.length; c++) {
          if (dt[c]) console.log(creature[b].drop[c].item.name);
          else console.log("??????");
        }
      }
    }
  }
}

function roll(itm, c, mi, ma) {
  mi = mi || 1;
  const r = random();
  if (r < c + (c / 100) * you.luck)
    giveItem(itm, !!ma ? rand(mi, ma) : rand(mi));
}

function handStr() {
  return (
    (((5000 + you.str * 800) *
      (1 + you.lvl * 0.03) *
      (1 + skl.unc.lvl * 0.1 + skl.fgt.lvl * 0.08 + skl.tghs.lvl * 0.11)) /
      1000) <<
    0
  );
}

function format3(a) {
  if (a.length > 3) {
    let b = new String();
    for (let i = 0; i < a.length; i++) {
      if ((a.length - i) % 3 == 0 && i > (a > 0 ? 0 : 1)) b += ",";
      b += a[i];
    }
    return b;
  }
  return a;
}

function formatw(a) {
  const b = ((Math.log(Math.abs(a + 1)) * 0.43429448190325178) | 0) + 1;
  if (b > 3) {
    const n = (a / 1000 ** (((b - 1) / 3) << 0)) * 10;
    return (
      ((n - ~~n >= 0.5 ? 1 : 0) + ~~n) / 10 + global.text.nt[((b - 4) / 3) << 0]
    );
  }
  return a;
}

function d_loc(text) {
  let txt;
  if (global.flags.inside === true) txt = "|" + text + "|";
  else txt = text;
  dom.d_lctt.innerHTML = txt;
  global.current_l.locn = text;
}

function rfeff(what) {
  let t = "";
  for (const a in what.sector)
    if (what.sector[a].effectors)
      for (const b in what.sector[a].effectors)
        t +=
          '<span style="color:' +
          what.sector[a].effectors[b].e.c +
          ';font-size:1.2em">&nbsp' +
          what.sector[a].effectors[b].e.x +
          "<span>";
  if (what.effectors)
    for (const a in what.effectors)
      t +=
        '<span style="color:' +
        what.effectors[a].e.c +
        ';font-size:1.2em">&nbsp' +
        what.effectors[a].e.x +
        "<span>";
  dom.d_lctte.innerHTML = t;
}

function lvlup(p, t) {
  if (t === 0) {
    p.hp = p.hp_r;
    p.str = p.str_r;
    p.agl = p.agl_r;
    p.spd = p.spd_r;
  } else {
    t = t || 1;
    p.lvl += t;
    const sb = randf(t * p.stat_p[1], 2 * t * p.stat_p[1]);
    p.str_r += sb;
    const sa = randf(t * p.stat_p[2], 2 * t * p.stat_p[2]);
    p.agl_r += sa;
    const si = randf(t * p.stat_p[3], 2 * t * p.stat_p[3]);
    p.int_r += si;
    let hpp;
    if (p.id === you.id)
      hpp = Math.round(
        rand(
          1.4 * Math.log(p.lvl) * t * p.stat_p[0],
          1.8 * p.lvl * t * p.stat_p[0],
        ),
      );
    else
      hpp = Math.round(
        rand(
          1.8 * Math.log(p.lvl) * t * p.stat_p[0],
          2.2 * p.lvl * t * p.stat_p[0],
        ),
      );
    p.hp_r += hpp;
    p.hpmax += hpp;
    p.hp += hpp;
    if (p.id !== you.id) p.hp = p.hpmax = p.hp_r;
    if (p.id != you.id) p.exp = (p.exp * (1 + t / 5) + 1) << 0;
    else {
      dom.d3.update();
      msg(
        i18n.t("runtime.systems.simulation.dialogue.level_up", {
          level: you.lvl,
        }),
        "orange",
      );
      msg(
        i18n.t("runtime.systems.simulation.dialogue.stat_gain", {
          stat: "STR",
          amount: Math.round(sb),
        }),
        "darkturquoise",
      );
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.additional_stat_gain", {
          stat: "AGL",
          amount: Math.round(sa),
        }),
        "darkturquoise",
      );
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.additional_stat_gain", {
          stat: "INT",
          amount: Math.round(si),
        }),
        "darkturquoise",
      );
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.additional_stat_gain", {
          stat: "HP",
          amount: hpp,
        }),
        "darkturquoise",
      );
      you.expnext_t = you.expnext();
      if (you.eqp[0].id === 10000) {
        you.eqp[0].cls[2] = (you.lvl / 4) << 0;
        you.eqp[0].aff[0] = (you.lvl / 5) << 0;
        you.eqp[0].ctype = 2;
      }
      if (global.stat.deadt < 1 && you.lvl >= 20) giveTitle(ttl.ndthextr);
    }
  }
  p.stat_r();
  update_d();
  callback.onLevel.fire(p);
}

function giveExp(exp, r, g, b) {
  if (!r)
    exp =
      Math.round(exp * you.exp_t * (0.4 + you.efficiency() * 0.6)) -
      (you.lvl - 1);
  exp = exp <= 0 ? 1 : exp;
  if (!b) {
    if (global.flags.m_blh === false)
      if (!g) {
        msg(
          i18n.t("runtime.systems.simulation.dialogue.exp_gain", {
            amount: formatw(exp),
          }),
          "hotpink",
        );
        global.stat.exptotl += exp;
      }
  } else {
    msg(
      i18n.t("runtime.systems.simulation.dialogue.exp_gain", {
        amount: formatw(exp),
      }),
      "hotpink",
    );
    global.stat.exptotl += exp;
  }
  if (you.exp + exp < you.expnext_t) you.exp += exp;
  else {
    const extra = you.exp + exp - you.expnext_t;
    you.exp = 0;
    lvlup(you);
    giveExp(extra, true, true);
  }
  dom.d5_2_1.update();
}

function giveSkExp(skl, exp, res) {
  exp = res === false ? exp : exp * skl.p; //skl.lastupd = time.minute+2;
  if (skl.exp + exp < skl.expnext_t) skl.exp += exp;
  else {
    const extra = skl.exp + exp - skl.expnext_t;
    skl.exp = 0;
    skl.lvl++;
    global.stat.slvs++;
    if (!scanbyid(you.skls, skl.id)) {
      you.skls.push(skl);
      msg(
        i18n.t("runtime.systems.simulation.dialogue.skill_unlocked", {
          skill: !!skl.bname ? skl.bname : skl.name,
        }),
        "aqua",
        skl,
        6,
      );
      if (!global.flags.sklu) {
        dom.ct_bt2.innerHTML = i18n.t("ui.navigation.skills");
        global.flags.sklu = true;
      }
    } else {
      msg(
        i18n.t("runtime.systems.simulation.dialogue.skill_level_up", {
          skill: !!skl.bname ? skl.bname : skl.name,
          level: skl.lvl,
        }),
        "deepskyblue",
        skl,
        6,
      );
    }
    skl.onLevel();
    skl.expnext_t = skl.expnext();
    if (!!skl.mlstn)
      for (let ss = 0; ss < skl.mlstn.length; ss++)
        if (skl.mlstn[ss].lv === skl.lvl && skl.mlstn[ss].g === false) {
          msg(
            i18n.t("runtime.systems.simulation.dialogue.perk_unlocked", {
              skill: skl.name,
              level: skl.mlstn[ss].lv,
            }),
            "lime",
            {
              x: skl.name,
              y: i18n.t("runtime.systems.simulation.dialogue.perk_details", {
                level: skl.mlstn[ss].lv,
                perk: skl.mlstn[ss].p,
              }),
            },
            7,
          );
          skl.mlstn[ss].f();
          skl.mlstn[ss].g = true;
        }
    giveSkExp(skl, extra, false);
  }
  skl.onGive(exp);
}

function giveTitle(title, lv) {
  if (title.have === false) {
    global.titles.push(title);
    if (title.id !== 0) global.titlese.push(title);
    you.title = title;
    title.have = true;
    if (!title.tget && title.talent) {
      title.talent();
      title.tget = true;
    }
    title.onGet();
    for (const x in global.ttlschk) global.ttlschk[x]();
    if (!lv) {
      msg(
        i18n.t("runtime.systems.simulation.dialogue.title_earned", {
          title: col('"' + title.name + '"', "orange"),
        }),
        "cyan",
        title,
        5,
      );
      dom.d3.update();
    }
  } else return;
}

function isort(type, flags) {
  empty(dom.inv_con);
  if (type === 1) for (let k = 0; k < inv.length; k++) renderItem(inv[k]);
  else {
    global.sinv = [];
    for (let k = 0; k < inv.length; k++)
      if (type === inv[k].stype) {
        global.sinv.push(inv[k]);
        renderItem(inv[k]);
      }
  }
  global.sm = type;
  if (flags && flags.tr) iftrunkopenc(1);
}

function rsort(type) {
  empty(dom.ct_bt1_1);
  if (type === 0 || !type)
    for (const ind in global.rec_d) renderRcp(global.rec_d[ind]);
  else {
    global.srcp = [];
    for (let k = 0; k < global.rec_d.length; k++)
      if (type === global.rec_d[k].type) global.srcp.push(global.rec_d[k]);
    for (let k = 0; k < global.srcp.length; k++) renderRcp(global.srcp[k]);
  }
  global.rm = type;
}

function objempty(obj) {
  for (const a in obj) return false;
}

function kill(obj) {
  obj = null;
  delete obj;
}

function effAct_test() {
  for (const index in you.eff) you.eff[index].use(creature.bat);
}

function canRead() {
  if (!global.flags.civil || global.flags.civil.btl) {
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.it_is_too_dangerous_to_read_right_now_8f0e5f3f",
      ),
      "red",
    );
    return false;
  }
  if (global.flags.rdng) {
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.you_re_already_reading_092cc72b",
      ),
      "orange",
    );
    return false;
  }
  if (global.flags.work) {
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.you_have_a_job_to_do_d21c56e5",
      ),
      "orange",
    );
    return false;
  }
  if (global.flags.busy) {
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.you_ll_have_to_stop_what_you_re_34217867",
      ),
      "orange",
    );
    return false;
  }
  if (global.flags.isshop) {
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.this_isn_t_the_library_8a62f77e",
      ),
      "orange",
    );
    return false;
  }
  if (global.flags.sleepmode) {
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.you_can_t_read_while_sleeping_688bb779",
      ),
      "orange",
    );
    return false;
  }
  return true;
}

function canScout(what) {
  if (what.data.scoutm) {
    for (const a in what.scout)
      if (
        what.data.gets[a] !== true &&
        (!what.scout[a].cond || what.scout[a].cond() === true)
      )
        return 1;
    return 2;
  }
  return 3;
}

function scoutGeneric(chs) {
  if (global.flags.isdark && !cansee())
    return msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.you_can_t_see_anything_5275568b",
      ),
      "grey",
    );
  const sct = select(chs.scout);
  const idx = chs.scout.indexOf(sct);
  giveSkExp(skl.scout, 0.3);
  chs.data.scout += 2 * (1 + skl.scout.lvl * 0.2);
  let m = 1;
  if (chs.data.scout >= chs.data.scoutm) {
    m = 5;
    chs.data.scout = 0;
  }
  if (
    (!sct.cond || sct.cond() === true) &&
    !chs.data.gets[idx] &&
    random() <=
      sct.c * m * (1 + skl.scout.lvl * 0.15) * (1 + chs.data.gotmod * 0.2)
  ) {
    global.stat.dsct++;
    chs.data.gotmod++;
    sct.f();
    giveSkExp(skl.scout, sct.exp ? sct.exp : 0.5 / sct.c);
  }
  let t = 2;
  for (const a in global.current_l.sector) {
    const m = canScout(global.current_l.sector[a]);
    if (m === 1) t = m;
  }
  if (canScout(global.current_l) >= 2 && t >= 2) {
    deactivateAct(act.scout);
    msg(
      i18n.t(
        "runtime.systems.simulation.dialogue.there_doesn_t_seem_to_be_anything_of_4f6f6d15",
      ),
    );
  }
}

function disassembleGeneric(obj) {
  for (const a in obj.dss) {
    let am = obj.dss[a].amount;
    if (obj.dss[a].q) am = (am + am * (obj.dss[a].q * skl.dssmb.lvl)) << 0;
    if (obj.dss[a].max) if (am > obj.dss[a].max) am = obj.dss[a].max;
    let c = 1;
    if (obj.slot) c = obj.dp / obj.dpmax;
    am = Math.ceil(am / (2 - c));
    giveItem(obj.dss[a].item, am);
  }
  giveSkExp(skl.dssmb, (2 ** obj.rar || 1) * 5 - 9.5);
  global.stat.dsst++;
  if (obj.slot) removeItem(obj);
  else {
    obj.amount--;
    if (obj.amount <= 0) removeItem(obj);
    else if (obj.stype === global.sm) updateInv(global.sinv.indexOf(obj));
    else if (global.sm === 1) updateInv(inv.indexOf(obj));
  }
}

global.text.ssns = i18n.get("gameText.ssns");

function wdrseason(flag) {
  const s = !flag ? getSeason(true) : global.text.ssns[getSeason() - 1];
  dom.d_weathers.innerHTML = "[" + s + "]";
  switch (getSeason()) {
    case 1:
      dom.d_weathers.style.color = "springgreen";
      dom.d_weathers.style.backgroundColor = "#253";
      break;
    case 2:
      dom.d_weathers.style.color = "lime";
      dom.d_weathers.style.backgroundColor = "#141";
      break;
    case 3:
      dom.d_weathers.style.color = "yellow";
      dom.d_weathers.style.backgroundColor = "#631";
      break;
    case 4:
      dom.d_weathers.style.color = "ghostwhite";
      dom.d_weathers.style.backgroundColor = "#556";
      break;
  }
}

function ontick() {
  global.stat.tick++;
  time.minute += global.timescale;
  wManager();
  for (const a in plans[0]) plans[0][a].f();
  dom.d_time.innerHTML =
    "<small>" + getDay(global.flags.tmmode || 2) + "</small> " + timeDisp(time); //global.stat.seed1=(random()*7e+7<<7)%7&7
  global.current_l.onStay();
  runEffectors(global.current_l.effectors);
  for (const a in sectors) {
    sectors[a].onStay();
    runEffectors(sectors[a].effectors);
  }
  giveSkExp(skl.aba, 0.004);
  const timeh = (time.minute / DAY) << 0;
  if (global.timehold !== timeh) {
    global.timehold = timeh; //proc when day passes
    for (const a in plans[1]) plans[1][a].f();
    for (const vnd in vendor) vendor[vnd].onDayPass();
    empty(dom.d_moon);
    dom.d_moon.innerHTML = global.text.lunarp[getLunarPhase()][0];
    addDesc(
      dom.d_moon,
      null,
      2,
      i18n.t("runtime.systems.simulation.description.lunar_phase_0004b314"),
      global.text.lunarp[getLunarPhase()][1],
    );
    wdrseason(global.flags.ssngaijin);
    if (getSeason() === 4) global.flags.iscold = true;
    else global.flags.iscold = false;
    global.offline_evil_index += 0.00008;
    /////////////////////////////////
    const timew = (time.minute / WEEK) << 0;
    if (global.timewold !== timew) {
      global.timewold = timew; //proc when week passes
      for (const a in plans[2]) plans[2][a].f();
    }
  }
  const h = getHour();
  if (h > 5 && h < 22) {
    global.flags.isday = true;
    dom.d_moon.style.display = "none";
  } else {
    if (
      global.flags.inside === false &&
      random() < 0.00002 * you.mods.stdstps
    ) {
      msg(
        i18n.t(
          "runtime.systems.simulation.dialogue.a_star_particle_landed_on_you_5dd8ad29",
        ),
        "gold",
        null,
        null,
        "darkblue",
      );
      giveItem(item.stdst);
    }
    global.flags.isday = false;
    dom.d_moon.style.display = "";
  }
  for (let g = 0; g < you.eff.length; g++)
    if (you.eff[g].type === 3 || you.eff[g].type === 5 || you.eff[g].type === 6)
      you.eff[g].use(you.eff[g].y, you.eff[g].z);
  for (let g = 0; g < global.current_m.eff.length; g++)
    if (
      global.current_m.eff[g].type === 3 ||
      global.current_m.eff[g].type === 5 ||
      global.current_m.eff[g].type === 6
    )
      global.current_m.eff[g].use(
        global.current_m.eff[g].y,
        global.current_m.eff[g].z,
      );
  if (global.flags.btl === true)
    timers.btl = setTimeout(fght(you, global.current_m), 1000 / global.fps);
  else
    giveSkExp(
      skl.mdt,
      0.0065 *
        (1 + skl.ptnc.lvl * 0.15) *
        (effect.incsk.active === true ? 2 : 1),
    );
  for (const obj in furn) furn[obj].use();
  //for(let q in qsts) qsts[q].tracker();
  if (you.sat > 0) {
    let lose = you.mods.sdrate;
    if (global.flags.iswet === true) lose *= 3 / (1 + skl.abw.lvl * 0.03);
    if (global.flags.iscold === true)
      lose += effect.cold.duration / 1000 / (1 + skl.coldr.lvl * 0.05);
    you.sat -= lose;
  } else giveSkExp(skl.fmn, 0.1);
  if (global.flags.sleepmode) global.stat.timeslp += global.timescale;
  if (random() < 0.00000001) {
    const au = new Audio("laugh6.wav");
    au.play();
  }
  dom.d5_3_1.update();
}

(function update() {
  setTimeout(function () {
    update();
    ontick();
  }, 1000 / global.fps);
})();

function select(arr) {
  return arr[rand(arr.length - 1)];
}

function nograd(s) {
  if (s === true) {
    for (let i = 0; i < document.getElementsByClassName("d2").length; i++)
      document.getElementsByClassName("d2")[i].style.background = "#0e574b";
    for (let i = 0; i < document.getElementsByClassName("d3").length; i++)
      document.getElementsByClassName("d3")[i].style.background = "#0e574b";
    for (let i = 0; i < document.getElementsByClassName("hp").length; i++)
      document.getElementsByClassName("hp")[i].style.background = "#91e6b6";
    for (let i = 0; i < document.getElementsByClassName("exp").length; i++)
      document.getElementsByClassName("exp")[i].style.background = "#ea9c83";
    for (let i = 0; i < document.getElementsByClassName("en").length; i++)
      document.getElementsByClassName("en")[i].style.background = "#4f3170";
    dom.inv_ctx.style.background =
      dom.inv_control_b.style.background =
      dom.ctrmg.style.background =
        "#00224e";
    dom.d7m_c.style.background = "#392c72";
    for (let i = 0; i < document.styleSheets[0].rules.length; i++)
      if (
        document.styleSheets[0].rules[i].selectorText ==
        ".opt_c:hover, .ct_bts:hover, .chs:hover, .bts:hover, .bbts:hover, .bts_b:hover, .inv_slot:hover, .bts_m:hover"
      )
        document.styleSheets[0].rules[i].style.background = "#0e574b";
    global.flags.grd_s = false;
  } else {
    for (let i = 0; i < document.getElementsByClassName("d2").length; i++)
      document.getElementsByClassName("d2")[i].style.background =
        "linear-gradient(90deg,rgb(25,129,108),rgb(1,41,39))";
    for (let i = 0; i < document.getElementsByClassName("d3").length; i++)
      document.getElementsByClassName("d3")[i].style.background =
        "linear-gradient(90deg,rgb(25,129,108),rgb(1,41,39))";
    for (let i = 0; i < document.getElementsByClassName("hp").length; i++)
      document.getElementsByClassName("hp")[i].style.background =
        "linear-gradient(90deg,rgb(254,239,157),rgb(45,223,206))";
    for (let i = 0; i < document.getElementsByClassName("exp").length; i++)
      document.getElementsByClassName("exp")[i].style.background =
        "linear-gradient(90deg,rgb(254,239,157),rgb(219,119,158))";
    for (let i = 0; i < document.getElementsByClassName("en").length; i++)
      document.getElementsByClassName("en")[i].style.background =
        "linear-gradient(270deg,rgb(124,68,112),rgb(29,29,113))";
    dom.inv_ctx.style.background =
      dom.inv_control_b.style.background =
      dom.ctrmg.style.background =
        "linear-gradient(90deg,rgb(0,5,51),rgb(0,65,107))";
    dom.d7m_c.style.background =
      "linear-gradient(270deg,rgb(84,28,112),rgb(29,62,116))";
    for (let i = 0; i < document.styleSheets[0].rules.length; i++)
      if (
        document.styleSheets[0].rules[i].selectorText ==
        ".opt_c:hover, .ct_bts:hover, .chs:hover, .bts:hover, .bbts:hover, .bts_b:hover, .inv_slot:hover, .bts_m:hover"
      )
        document.styleSheets[0].rules[i].style.background =
          "linear-gradient(90deg,rgb(25,129,108),rgb(1,41,39))";
    global.flags.grd_s = true;
  }
}

function reduce(itm, am) {
  if (am) {
    itm.amount = itm.amount - am <= 0 ? 0 : itm.amount - am;
  }
  if (itm.amount <= 0) {
    removeItem(itm);
    updateTrunkLeftItem(itm, true);
  } else if (global.sm === 1) updateInv(inv.indexOf(itm));
  else if (global.sm === itm.stype) updateInv(global.sinv.indexOf(itm));
  updateTrunkLeftItem(itm);
}
function cansee() {
  if ((global.flags.isdark && you.mods.light > 0) || skl.ntst.lvl >= 12)
    return true;
}

function col(txt, c, bc) {
  let cc;
  let bcc;
  if (c) cc = "color:" + c + ";";
  if (bc) bcc = "background-color:" + bc + ";";
  return (
    "<span" +
    (c ? ' style="' + cc + (bc ? bcc : "") + '"' : "") +
    ">" +
    txt +
    "</span>"
  );
}

function usePlayerWeaponSkill() {
  switch (you.eqp[0].wtype) {
    case 0:
      skl.unc.use();
      break;
    case 1:
      skl.srdc.use();
      break;
    case 2:
      skl.axc.use();
      break;
    case 3:
      skl.knfc.use();
      break;
    case 4:
      skl.plrmc.use();
      break;
    case 5:
      skl.hmrc.use();
      break;
    case 6:
      skl.stfc.use();
      break;
  }
}

function printBodyPartHit(partNumber) {
  switch (partNumber) {
    case 2:
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.head_25949a6c"),
        "orange",
      );
      break;
    case 3:
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.body_ca5fc7b5"),
        "orange",
      );
      break;
    case 4:
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.l_hand_7177bbdd"),
        "orange",
      );
      break;
    case 5:
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.r_hand_9f6e57e4"),
        "orange",
      );
      break;
    case 6:
      msg_add(
        i18n.t("runtime.systems.simulation.dialogue.legs_91543f22"),
        "orange",
      );
      break;
  }
}

function printCritIfCrit() {
  if (global.flags.crti) {
    msg_add(
      i18n.t("runtime.systems.simulation.dialogue.crit_e443ee79"),
      "yellow",
    );
    global.flags.crti = false;
  }
}

function printDamageNumber(ddmg) {
  let col;
  let bcol = "";
  let shd = "";
  switch (global.atype_d) {
    case 0:
      col = "pink";
      break;
    case 1:
      col = "lime";
      break;
    case 2:
      col = "yellow";
      break;
    case 3:
      col = "orange";
      bcol = "crimson";
      break;
    case 4:
      col = "cyan";
      break;
    case 5:
      col = "lightgoldenrodyellow";
      shd = "gold 0px 0px 5px";
      break;
    case 6:
      col = "thistle";
      shd = "blueviolet 0px 0px 5px";
      break;
  }
  if (ddmg > 9999) formatw(ddmg);
  msg_add(ddmg, col, bcol, shd);
}

function printHitMessage(attackerName, ddmg, targetsPlayer) {
  if (global.mabl.id === 0)
    msg(
      attackerName +
        (targetsPlayer === true ? global.mabl.atrg : global.mabl.btrg),
    );
  else
    msg(
      (targetsPlayer === true ? attackerName : "") +
        (targetsPlayer === true
          ? global.mabl.atrg
          : i18n.t("runtime.systems.simulation.dialogue.player_action", {
              action: global.mabl.btrg,
            })),
    );
  printHitMessageResult(ddmg, targetsPlayer);
}

function printMultihitMessage(times, attackerName, acc_dmg, targetsPlayer) {
  msg(
    i18n.t("runtime.systems.simulation.dialogue.multihit", {
      attacker: attackerName,
      hits: times - global.miss,
      attempts: times,
    }),
  );
  printHitMessageResult(acc_dmg, targetsPlayer);
  if (time - global.miss > 0) printBodyPartHit(global.target_g);
}

function printHitMessageResult(ddmg, targetsPlayer) {
  printDamageNumber(ddmg);
  printCritIfCrit();
  if (targetsPlayer === true && !global.flags.msd) printBodyPartHit(global.t_n);
}

function doSingleAttack(attacker, defender, isPlayerAttacking) {
  if (isPlayerAttacking) {
    let dm = skl.fgt.use();
    if (you.eqp[0].twoh === true) dm += skl.twoh.use();
    you.str += dm;
    you.int += dm;
    usePlayerWeaponSkill();
  }
  attacker.battle_ai(attacker, defender);
}

function getlastd() {
  switch (global.atkdfty[0]) {
    case 1:
      return i18n.t("runtime.systems.simulation.casualty.struck_by_lightning");
      break;
    case 2:
      switch (global.atkdfty[1]) {
        case 1:
          return i18n.t(
            "runtime.systems.simulation.casualty.suffocated_from_poison",
          );
          break;
        case 2:
          return i18n.t(
            "runtime.systems.simulation.casualty.suffocated_from_venom",
          );
          break;
        case 3:
          return i18n.t("runtime.systems.simulation.casualty.bled_out");
          break;
        case 4:
          return i18n.t(
            "runtime.systems.simulation.casualty.rotten_from_corruption",
          );
          break;
      }
      break;
    case 3:
      let txt = "";
      const fc = ["", "", ""];
      switch (global.atkdftydt.a) {
        case 0:
          fc[0] = "pink";
          break;
        case 1:
          fc[0] = "lime";
          break;
        case 2:
          fc[0] = "yellow";
          break;
        case 3:
          fc[0] = "orange";
          fc[1] = "crimson";
          break;
        case 4:
          fc[0] = "cyan";
          break;
        case 5:
          fc[0] = "lightgoldenrodyellow";
          fc[2] = "gold 0px 0px 5px";
          break;
        case 6:
          fc[0] = "thistle";
          fc[2] = "blueviolet 0px 0px 5px";
          break;
      }
      switch (global.atkdftydt.c) {
        case 0:
          txt +=
            '<span style="color:' +
            fc[0] +
            ";background-color:" +
            fc[1] +
            ";text-shadow:" +
            fc[2] +
            '">' +
            select(
              i18n.get("runtime.systems.simulation.casualty.slashing_causes"),
            ) +
            "</span>";
          break;
        case 1:
          txt +=
            '<span style="color:' +
            fc[0] +
            ";background-color:" +
            fc[1] +
            ";text-shadow:" +
            fc[2] +
            '">' +
            select(
              i18n.get("runtime.systems.simulation.casualty.piercing_causes"),
            ) +
            "</span>";
          break;
        case 2:
          txt +=
            '<span style="color:' +
            fc[0] +
            ";background-color:" +
            fc[1] +
            ";text-shadow:" +
            fc[2] +
            '">' +
            select(
              i18n.get("runtime.systems.simulation.casualty.blunt_causes"),
            ) +
            "</span>";
          break;
      }
      let attacker = "";
      for (const a in creature)
        if (creature[a].id === global.atkdftydt.id) {
          attacker = creature[a].name;
          break;
        }
      return i18n.t("runtime.systems.simulation.casualty.caused_by", {
        cause: txt,
        attacker,
      });
      break;
    default:
      return i18n.t("runtime.systems.simulation.casualty.unknown");
      break;
  }
}

function draggable(root, target) {
  root.addEventListener("mousedown", function (x) {
    global.ctarget = target;
    this.boxoffsetx = x.clientX - parseInt(target.style.left);
    this.boxoffsety = x.clientY - parseInt(target.style.top);
    global.croot = root;
    document.body.addEventListener("mousemove", draggablemove);
  });
  root.addEventListener("mouseup", function (x) {
    global.ctarget = null;
    global.croot = null;
    document.body.removeEventListener("mousemove", draggablemove);
  });
}

function draggablemove(x) {
  if (global.ctarget) {
    global.ctarget.style.left = x.clientX - global.croot.boxoffsetx;
    global.ctarget.style.top = x.clientY - global.croot.boxoffsety;
  }
}

function _dbgman() {
  let g = 0;
  for (const a in chss) if (chss[a].id > g) g = chss[a].id;
  return g;
}
function _dbgitc() {
  let g = 0;
  for (const a in item) g++;
  for (const a in acc) g++;
  for (const a in sld) g++;
  for (a in eqp) g++;
  for (const a in wpn) g++;
  return g;
}
function _dbgspawn(arr, times) {
  const result = [];
  for (let g = 0; g < times; g++) {
    for (const a in arr) {
      let t = 0;
      if (random() < arr[a].chance + (arr[a].chance / 100) * you.luck) {
        for (const b in result) {
          if (result[b].item.id === arr[a].item.id) {
            result[b].am++;
            break;
          }
          if (++t === result.length) result.push({ item: arr[a].item, am: 1 });
        }
        if (!result.length > 0) result.push({ item: arr[a].item, am: 1 });
      }
    }
  }
  console.log("Spawn from the drop array " + times + " times\n::RESULT::");
  for (const a in result)
    console.log(result[a].item.name + ": x" + result[a].am);
  console.log("::END::");
}

function _dbggibberish(w, l) {
  let a = new String();
  for (let b = 0; b < w; b++) {
    lr = rand(1, l);
    for (let c = 0; c < lr; c++) {
      a += String.fromCharCode(rand(40960, 42124));
    }
    a += " ";
  }
  return a;
}

function giveall(what) {
  /*switch(what){
    case item: for(let a in item) giveItem(item[a]);break;
    case wpn: for(let a in wpn) giveItem(wpn[a]);break;
    case eqp: for(let a in eqp) giveItem(eqp[a]);break;
    case acc: for(let a in acc) giveItem(acc[a]);break;
    case ttl: for(let a in ttl) giveTitle(ttl[a]);break;
    case rcp: for(let a in rcp) giveRcp(rcp[a]);break;
  }*/
}

function scan(arr, val, am) {
  if (am) {
    for (const obj in arr)
      if (arr[obj].id === val.id && arr[obj].amount >= am) return true;
  } else for (const obj in arr) if (arr[obj] === val) return true;
}

//finder functions
function scanbyid(arr, val) {
  for (const obj in arr) if (arr[obj].id === val) return true;
}
function scanbyuid(arr, val) {
  for (const obj in arr) if (arr[obj].data.uid === val) return true;
}
function find(arr, val) {
  for (const obj in arr) if (arr[obj] === val) return arr[obj];
}
function findbyid(arr, val) {
  for (const obj in arr) if (arr[obj].id === val) return arr[obj];
}
function wearing(itm) {
  for (const obj in you.eqp)
    if (itm.data.uid === you.eqp[obj].data.uid && you.eqp[obj].id !== 10000)
      return true;
}
function wearingany(itm) {
  for (const obj in you.eqp)
    if (itm.id === you.eqp[obj].id && you.eqp[obj].id !== 10000) return true;
}
function findbest(arr, itm) {
  const temp = [];
  for (const a in arr) if (arr[a].id === itm.id) temp.push(arr[a]);
  return temp.sort(function (a, b) {
    if (a.dp > b.dp) return -1;
    return 1;
  });
}
function findworst(arr, itm) {
  const temp = [];
  for (const a in arr) if (arr[a].id === itm.id) temp.push(arr[a]);
  return temp.sort(function (a, b) {
    if (a.dp < b.dp) return -1;
    return 1;
  });
}

function addPlan(plan, data) {
  const p = deepCopy(plan);
  if (data) p.data = data;
  plans[plan.id].push(p);
}
