# Time Tablez - Simple ICS Calendar Comparison Tool
![image](https://github.com/zzz-Ricky/time-tablez/assets/120093810/543dbaf1-3615-474d-9290-c43c32aa434f)
## About
Time tablez is an ICS calendar visualization and comparison tool based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).
The app is intended to be used with iCalendar format (.ics) schedule files commonly used by university time tables and events generated by popular apps such as Microsoft Outlook.
TimeTablez is mainly written in Javascript with Electron and React. Intrinsically, the source code of the program is designed to be easy to extend and modify. 
This program was developed to practice working with these frameworks.

All backend functionality is performed locally on your computer, as such, the app is can run in offline settings and does not require any external web connection to run.
## Features
- Importing and Viewing ICS calendar files
	- Handles simple ICS repetition and event timing
- Visually comparing calendars week by week
	- Enabling and Disabling comparison overlays
	- Enabling and Disabling visible schedules
- Exporting/Importing sets of Calendars as JSON
	- Naming Calendar sets
	- Naming Visible Calendars
- 12/24h Time Formatting
- Calendar to select the year, month, and week
## Usage

![image](https://github.com/zzz-Ricky/time-tablez/blob/main/assets/icon.png)
- Windows:
    - Download the program from the [Releases Page](https://github.com/zzz-Ricky/time-tablez/releases) and run the appropriate executable file.
- MacOS
    - Download the Repository and run the following command after changing to the project directory in your IDE terminal
      ```
      npm run package -- --mac
      ```
- Linux
  - Download the Repository and run the following command after changing to the project directory in your IDE terminal
    ```
    npm run package -- --linux
    ```
  *Note: I unfortunately cannot guarantee that these commands will run successfully on their respective operating systems since the output of these code snippets did not match the expected functionality as listed in the [electron-react-boilerplate doccumentation](https://electron-react-boilerplate.js.org/docs/packaging) on a Windows machine. Please proceed at your own discretion*
### Known Limitations
Time Tablez is not intended to be used in critical settings which involve advanced time analysis and precise date calculations.
By nature, this program will unfortunately not include any features that facilitate the use of external accounts and APIs for high volume comparisons.
At this current time, please be aware that the program is subject to issues and bug fixes.
Possible untested sources of errors may include:
 - Attempting to render events spanning across multiple days
 - Edge case date rounding errors
 - Visual CSS scaling errors at high screen resolutions.
 - Unexpected behaviors on linux/macOS
