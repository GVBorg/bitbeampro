# BitBeam Site · Demo (v3)

Демо-версия программы: только страница Live, без выходов на свет.

## Вкладки
MAIN (Live), ABOUT, DOWNLOAD. ABOUT и DOWNLOAD пока пустые, адреса site.html#about и site.html#download.

## Что на MAIN
- Слева: SLOW / MID / FAST, Random (+ количество), Auto Show со счётчиком 1–16, 6 пресетов (банк 1), Transition, Save Current, Save to Preset…
- По центру: тот же 3D-визуализатор.
- Под визуализатором (прокрутка вниз): колёса Color Chase и Movement — работают с выбранной группой.
- Справа: Fixture Groups. All Groups выделяет все световые приборы (дым-машина не входит ни в одну группу, она включается только кнопкой SMOKE).
- Сверху: Master, Strobe, Blackout, Blinder, BPM / Tap.

## Что убрано
Track Show, D6, MIDI-контроллеры, голос, Ableton Link, калибровка, Art-Net / sACN / USB / Wireless DMX, второй экран, анализатор звука.
Оставлены 8 модулей, от которых зависит интерфейс (без них пропадали BPM, Transition, миниатюры пресетов, ломался Random):
midi-map73.js, midi73.js, calibration-reference.js, visual-calibration36.js, workspace35.js, advanced.js, manual-documents.js, studio.js.

## Исправленный баг
В программе найден бесконечный цикл: после Random, при открытом колесе чейза, перерисовка Live → проверка чейза → снова перерисовка (radial-panels.js, chase76 → revert82 → renderLive). Для сайта используется исправленная копия radial-panels-site.js; файлы программы не тронуты. В саму программу это стоит добавить патчем.

## Файлы
- site.html, site-mode.css, site-mode.js, radial-panels-site.js — положить в web/ установленного BitBeam и открыть http://localhost:8743/site.html (для просмотра на Маке).
- BitBeam_Demo_web.zip — готовая облегчённая сборка интерфейса для будущего сайта: только нужные файлы, сжатые; 3D-библиотека урезана до используемого.
  Вес страницы: было 2,8 МБ, стало 1,7 МБ (≈0,45 МБ после сжатия хостингом).
  Не класть в установленное приложение — там сжатые версии тех же файлов.
