; AROICE - Smart Scroll (First Edition)
#Persistent
#SingleInstance Force
#InstallKeybdHook
#UseHook
SetTitleMatchMode, 2

; Check command line parameters for /minimized switch
for n, param in A_Args
{
    if (param = "/minimized")
    {
        startMinimized := true
        break
    }
}

; Set custom tray icon
Menu, Tray, Icon, %A_ScriptDir%\assets\icons\icon-32x32.png
Menu, Tray, Tip, Smart Scroll by AROICE

; Configure tray menu to open app on click
Menu, Tray, Click, 1  ; Single click to trigger default action
Menu, Tray, Add, Open, ShowApp  ; Add Open item that calls ShowApp
Menu, Tray, Default, Open  ; Set Open as default action (AFTER adding the item)
Menu, Tray, Add  ; Add separator
Menu, Tray, Add, Exit, ExitLabel  ; Add Exit item with proper label

; --- GLOBAL VARIABLES ---
global selectedMode := "mute"  ; Default mode is mute
global startWithWindows := false  ; Default startup setting
global startMinimized := true  ; Default to start minimized

; --- HOTKEY VARIABLES ---
global rotateModesHotkey := "#+F1"   ; Default Win+Shift+F1 for rotating modes
global toggleWindowHotkey := "#+F2"  ; Default Win+Shift+F2 for toggling window

; --- COLOR SCHEME VARIABLES ---
global primaryColor := "3A7BCA"    ; Primary blue accent color
global secondaryColor := "64B5F6"  ; Secondary lighter blue
global accentColor := "FF5252"     ; Accent red color for important actions
global bgColor := "F9FBFF"         ; Slightly blue-tinted background for cohesion
global darkTextColor := "2C3E50"   ; Dark blue-gray for main text
global lightTextColor := "7F8C8D"  ; Light gray for secondary text
global borderColor := "CFD8DC"     ; Light blue-gray border color
global highlightBgColor := "E3F2FD" ; Very light blue for highlight backgrounds
global successColor := "4CAF50"    ; Green for success messages

; Add new global variables for toggle switch colors
global switchOnColor := "4CAF50"    ; Green for enabled switches
global switchOffColor := "E0E0E0"   ; Light gray for disabled switches
global switchTrackColor := "EEEEEE" ; Track color for switches
global switchThumbColor := "FFFFFF" ; White color for switch thumb

; --- CUSTOM GUI STYLING ---
Gui, Color, %bgColor%
Gui, Font, s10 c%darkTextColor%, Segoe UI  ; Modern font
Gui, +LastFound +HwndGuiHwnd

; --- HEADER SECTION ---
Gui, Add, Picture, x15 y10 w32 h32, %A_ScriptDir%\assets\app.png
Gui, Font, s16 Bold c%primaryColor%, Segoe UI
Gui, Add, Text, x55 y12, Smart Scroll
Gui, Font, s9 Norm c%lightTextColor%, Segoe UI
Gui, Add, Text, x55 y38, Modern. Efficient. Seamless.

; ; --- Close button (X in top right) ---
; Gui, Font, s10 Bold c%accentColor%, Segoe UI
; Gui, Add, Text, x415 y10 w25 h25 gGuiClose Center, X
; Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

; --- SEPARATOR LINE ---
Gui, Add, Text, x15 y55 w420 h2 0x10 c%borderColor% ; Etched horizontal line

; --- TABBED INTERFACE ---
Gui, Add, Tab2, x15 y65 w420 h280 vMainTab +Background%bgColor% +Theme, Settings|Hotkeys|Help|About

; --- SETTINGS TAB ---
Gui, Tab, 1
Gui, Add, Picture, x25 y95 w24 h24, %A_ScriptDir%\assets\mode.png
Gui, Font, s10 Bold c%primaryColor%, Segoe UI
Gui, Add, Text, x55 y95, Select Mode for Scroll Behavior:
Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

; Standard radio buttons with group box
Gui, Add, GroupBox, x25 y125 w400 h140 c%borderColor%, Available Modes
Gui, Add, Radio, x40 y150 vselectedModeM Checked gSelectMute c%darkTextColor%, Mute Mode
Gui, Add, Text, x175 y150 c%lightTextColor%, Scrolls when system is muted

Gui, Add, Radio, x40 y180 vselectedModeS gSelectScroll c%darkTextColor%, Scroll Lock Mode
Gui, Add, Text, x175 y180 c%lightTextColor%, Scrolls when ScrollLock is ON

Gui, Add, Radio, x40 y210 vselectedModeN gSelectNum c%darkTextColor%, Num Lock Mode
Gui, Add, Text, x175 y210 c%lightTextColor%, Scrolls when NumLock is OFF

; Add startup option
Gui, Add, GroupBox, x25 y270 w270 h90 c%borderColor%, Startup Options
Gui, Add, Checkbox, x40 y295 vStartWithWindowsOpt gToggleStartup, Start with Windows
Gui, Add, Checkbox, x40 y320 vStartMinimizedOpt gToggleMinimized Checked, Start minimized in system tray
Gui, Font, s9 Norm c%lightTextColor%, Segoe UI
Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

; Save button with themed colors
Gui, Add, Picture, x340 y275 w16 h16, %A_ScriptDir%\assets\Save.png
Gui, Add, Button, x360 y273 w70 h25 gSaveSettings vSaveBtn +Background%secondaryColor% c%bgColor%, Save

; --- HOTKEYS TAB ---
Gui, Tab, 2
Gui, Add, Picture, x25 y95 w24 h24, %A_ScriptDir%\assets\key.png
Gui, Font, s11 Bold c%primaryColor%, Segoe UI
Gui, Add, Text, x55 y95, Application Hotkeys
Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

; Hotkeys group box
Gui, Add, GroupBox, x25 y125 w400 h180 c%borderColor%, Hotkey Configuration

; Rotate Modes Hotkey
Gui, Font, s10 Bold c%darkTextColor%, Segoe UI
Gui, Add, Text, x40 y150, Rotate Between Modes:
Gui, Font, s9 Norm c%lightTextColor%, Segoe UI
Gui, Add, Text, x40 y170, Cycles through Mute, Scroll Lock, and Num Lock modes
Gui, Font, s9 c%darkTextColor%, Segoe UI
Gui, Add, Text, x320 y150, Win+Shift+F1

; Toggle Window Hotkey
Gui, Font, s10 Bold c%darkTextColor%, Segoe UI
Gui, Add, Text, x40 y200, Toggle Application Window:
Gui, Font, s9 Norm c%lightTextColor%, Segoe UI
Gui, Add, Text, x40 y220, Opens the app if hidden, hides the app if visible
Gui, Font, s9 c%darkTextColor%, Segoe UI
Gui, Add, Text, x320 y200, Win+Shift+F2

; Add a visual icon for saving/settings
Gui, Add, Picture, x400 y275 w16 h16, %A_ScriptDir%\assets\Save.png

; --- HELP TAB ---
Gui, Tab, 3
; Header without shadow effect
Gui, Font, s11 Bold c%primaryColor%, Segoe UI
Gui, Add, Text, x25 y95, How Smart Scroll Works
Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

; GroupBox without shadow
Gui, Add, GroupBox, x25 y125 w400 h220 c%borderColor%, Help Guide

; Formatted help text with better visual hierarchy
helpText = 
(
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SMART SCROLL - QUICK OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Smart Scroll turns your volume wheel into a scroll wheel without losing volume control functionality.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AVAILABLE MODES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ MUTE MODE:
  Volume wheel scrolls when system is muted

■ SCROLL LOCK MODE:
  Volume wheel scrolls when ScrollLock is ON

■ NUM LOCK MODE:
  Volume wheel scrolls when NumLock is OFF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HOW TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Select your preferred mode in Settings
2. Toggle the mode ON when you want to scroll
3. Use volume controls to scroll up/down
4. Toggle the mode OFF to return to volume control

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIPS & TRICKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• The app runs silently in background
• Look for notifications when settings change
• Works in most applications that support scrolling
)

; Fix scrolling issues by using standard options and white background
; Add edit control with monospaced font for better alignment of formatted text
Gui, Font, s9 c%darkTextColor%, Consolas
Gui, Add, Edit, x35 y145 w380 h190 ReadOnly VScroll -Border BackgroundWhite, %helpText%
Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

; --- ABOUT TAB ---
Gui, Tab, 4
Gui, Add, Picture, x25 y95 w24 h24, %A_ScriptDir%\assets\app.png
Gui, Font, s11 Bold c%primaryColor%, Segoe UI
Gui, Add, Text, x55 y95, Smart Scroll by AROICE
Gui, Font, s10 Norm c%darkTextColor%, Segoe UI

Gui, Add, GroupBox, x25 y125 w400 h200 c%borderColor%, About
Gui, Add, Text, x40 y145 c%darkTextColor%, Version: 1.0.0 (First Edition)
Gui, Add, Text, x40 y170 c%darkTextColor%, Turn your volume wheel into a scroll wheel
Gui, Add, Text, x40 y190 c%darkTextColor%, and enhance your productivity.
Gui, Font, s10 c%primaryColor%, Segoe UI
Gui, Add, Text, x40 y220 gOpenGitHub, Developed with ❤️ by AROICE
Gui, Font, s10 Norm c%lightTextColor%, Segoe UI
Gui, Add, Text, x40 y245, © 2025 AROICE. All rights reserved.

; --- STATUS BAR ---
Gui, Add, Text, x15 y355 w420 h2 0x10 c%borderColor% ; Etched horizontal line
Gui, Font, s8 c%lightTextColor%, Segoe UI
Gui, Add, Text, x15 y365, WIN+Shift+F1 to toogle between modes • Press WIN+Shift+F2 to open/close this window

; Show the GUI (no rounded corners for better compatibility)
; Check if we should start minimized
if (startMinimized) {
    ; Start minimized (don't show window)
    ; Just create the GUI but don't show it
    Gui, +LastFound
} else {
    ; Show the window normally
    Gui, Show, w450 h400, Smart Scroll
}

; Initialize the selected mode
HighlightSelection()

; Initialize hotkeys
Hotkey, %rotateModesHotkey%, RotateModes, On
Hotkey, %toggleWindowHotkey%, ToggleWindow, On

; Check if app is set to start with Windows and update checkbox
CheckStartupStatus()
; Initialize the minimized checkbox state
GuiControl,, StartMinimizedOpt, %startMinimized%

return

; --- CLOSE BUTTON HANDLER ---
GuiClose:
    Gui, Hide
return

; --- MODE SELECT HANDLERS ---
SelectMute:
    ; Uncheck other radio buttons first
    GuiControl,, selectedModeS, 0
    GuiControl,, selectedModeN, 0
    ; Set this button as checked
    GuiControl,, selectedModeM, 1
    ; Update selected mode
    selectedMode := "mute"
    HighlightSelection()
return

SelectScroll:
    ; Uncheck other radio buttons first
    GuiControl,, selectedModeM, 0
    GuiControl,, selectedModeN, 0
    ; Set this button as checked
    GuiControl,, selectedModeS, 1
    ; Update selected mode
    selectedMode := "scrolllock"
    HighlightSelection()
return

SelectNum:
    ; Uncheck other radio buttons first
    GuiControl,, selectedModeM, 0
    GuiControl,, selectedModeS, 0
    ; Set this button as checked
    GuiControl,, selectedModeN, 1
    ; Update selected mode
    selectedMode := "numlock"
    HighlightSelection()
return

; --- HIGHLIGHT SELECTION FUNCTION ---
HighlightSelection() {
    global selectedMode, highlightBgColor, primaryColor, darkTextColor
    
    ; Apply styling based on selection
    if (selectedMode = "mute") {
        GuiControl, +Background%highlightBgColor%, selectedModeM
        GuiControl, +c%primaryColor%, selectedModeM
    } else {
        GuiControl, +Background%bgColor%, selectedModeM
        GuiControl, +c%darkTextColor%, selectedModeM
    }
    
    if (selectedMode = "scrolllock") {
        GuiControl, +Background%highlightBgColor%, selectedModeS
        GuiControl, +c%primaryColor%, selectedModeS
    } else {
        GuiControl, +Background%bgColor%, selectedModeS
        GuiControl, +c%darkTextColor%, selectedModeS
    }
    
    if (selectedMode = "numlock") {
        GuiControl, +Background%highlightBgColor%, selectedModeN
        GuiControl, +c%primaryColor%, selectedModeN
    } else {
        GuiControl, +Background%bgColor%, selectedModeN
        GuiControl, +c%darkTextColor%, selectedModeN
    }
}

; --- SAVE SETTINGS ---
SaveSettings:
    Gui, Submit, NoHide
    
    ; Show success visual feedback with themed colors
    GuiControl, +Background%successColor%, SaveBtn
    Sleep, 300
    GuiControl, +Background%secondaryColor%, SaveBtn
    
    ; Show notification with themed icon
    TrayTip, Smart Scroll, ✅ Settings Saved!`n⚙️Current Mode: %selectedMode%, , 1
    Gui, Hide
return

; --- MODE LOGIC FUNCTION ---
ShouldScroll() {
    global selectedMode
    if (selectedMode = "mute") {
        SoundGet, isMuted, , MUTE
        return (isMuted = "On")
    } else if (selectedMode = "scrolllock") {
        return GetKeyState("ScrollLock", "T")
    } else if (selectedMode = "numlock") {
        return !GetKeyState("NumLock", "T")
    }
    return false
}

; --- MAIN FUNCTIONALITY ---
Volume_Down::
if (ShouldScroll())
    Send {WheelUp}
else
    Send {Volume_Down}
return

Volume_Up::
if (ShouldScroll())
    Send {WheelDown}
else
    Send {Volume_Up}
return

; --- SHORTCUTS ---
^+s::Gui, Show,, Smart Scroll  ; Ctrl+Shift+S to open GUI
^+q::ExitApp                   ; Ctrl+Shift+Q to quit

; --- HOTKEY HANDLERS AND FUNCTIONS ---
; Handler for updating the rotate modes hotkey
UpdateRotateHotkey:
    Gui, Submit, NoHide
    return

; Handler for updating the toggle window hotkey
UpdateToggleHotkey:
    Gui, Submit, NoHide
    return

; Apply hotkeys button handler
ApplyHotkeys:
    Gui, Submit, NoHide
    
    ; Disable existing hotkeys first
    Hotkey, %rotateModesHotkey%, RotateModes, Off
    Hotkey, %toggleWindowHotkey%, ToggleWindow, Off
    
    ; Update hotkey variables with new values
    rotateModesHotkey := RotateModeHotkeyCtrl
    toggleWindowHotkey := ToggleWindowHotkeyCtrl
    
    ; Enable new hotkeys
    Hotkey, %rotateModesHotkey%, RotateModes, On
    Hotkey, %toggleWindowHotkey%, ToggleWindow, On
    
    ; Show success visual feedback
    GuiControl, +Background%successColor%, ApplyBtn
    Sleep, 300
    GuiControl, +Background%secondaryColor%, ApplyBtn
    
    ; Show notification
    TrayTip, Smart Scroll, ✅ Hotkeys Applied!`n⚙️ Modes: %rotateModesHotkey%`n⚙️ Toggle: %toggleWindowHotkey%, , 1
return

; Function to rotate through modes (called by hotkey)
RotateModes:
    if (selectedMode = "mute") {
        ; Switch to scroll lock mode
        GuiControl,, selectedModeM, 0
        GuiControl,, selectedModeS, 1
        GuiControl,, selectedModeN, 0
        selectedMode := "scrolllock"
    } 
    else if (selectedMode = "scrolllock") {
        ; Switch to num lock mode
        GuiControl,, selectedModeM, 0
        GuiControl,, selectedModeS, 0
        GuiControl,, selectedModeN, 1
        selectedMode := "numlock"
    }
    else {
        ; Switch to mute mode
        GuiControl,, selectedModeM, 1
        GuiControl,, selectedModeS, 0
        GuiControl,, selectedModeN, 0
        selectedMode := "mute"
    }
    
    ; Update visual styling
    HighlightSelection()
    
    ; Show notification
    TrayTip, Smart Scroll, Mode Changed: %selectedMode%, , 1
return

; Function to toggle app window (called by hotkey)
ToggleWindow:
    if WinExist("ahk_id " GuiHwnd) {
        Gui, Hide
    } else {
        Gui, Show
    }
return

; Function to open GitHub page
OpenGitHub:
    Run, https://github.com/Aryan-Techie
return

; --- START WITH WINDOWS FUNCTIONS ---
; Check if app is set to start with Windows
CheckStartupStatus() {
    ; Get the path to the current script
    appPath := A_ScriptFullPath
    
    ; Check if the app is in the Windows startup registry
    RegRead, startValue, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run, SmartScroll
    
    ; Update global variable and checkbox based on registry value
    if (startValue = appPath) {
        startWithWindows := true
        GuiControl,, StartWithWindowsOpt, 1
    } else {
        startWithWindows := false
        GuiControl,, StartWithWindowsOpt, 0
    }
}

; Toggle startup with Windows
ToggleStartup:
    Gui, Submit, NoHide
    
    ; Get current checkbox state and update startup accordingly
    if (StartWithWindowsOpt) {
        ; Enable startup with Windows
        EnableStartup()
    } else {
        ; Disable startup with Windows
        DisableStartup()
    }
return

; Enable startup with Windows
EnableStartup() {
    ; Set registry entry to make app start with Windows
    ; If set to start minimized, include the /minimized parameter
    if (startMinimized) {
        RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run, SmartScroll, "%A_ScriptFullPath%" /minimized
    } else {
        RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run, SmartScroll, %A_ScriptFullPath%
    }
    
    ; Update global variable and show notification
    startWithWindows := true
    TrayTip, Smart Scroll, ✅ Application will now start with Windows, , 1
}

; Disable startup with Windows
DisableStartup() {
    ; Remove registry entry to prevent app from starting with Windows
    RegDelete, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run, SmartScroll
    
    ; Update global variable and show notification
    startWithWindows := false
    TrayTip, Smart Scroll, ❌ Application will no longer start with Windows, , 1
}

; Toggle minimized startup option
ToggleMinimized:
    Gui, Submit, NoHide
    
    ; Update global variable based on checkbox state
    startMinimized := StartMinimizedOpt
    
    ; Show notification about the change
    if (startMinimized) {
        TrayTip, Smart Scroll, ✅ Application will start minimized in system tray, , 1
    } else {
        TrayTip, Smart Scroll, ℹ️ Application will show window on startup, , 1
    }
return

; Function to show the app window (called by tray menu)
ShowApp:
    Gui, Show
return

; Function to exit the application (called by tray menu)
ExitLabel:
    ExitApp
return
