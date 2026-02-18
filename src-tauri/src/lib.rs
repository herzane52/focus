use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub title: String,
    pub topic: String,
    pub questions: i32,
    pub note: String,
    pub completed: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Exam {
    pub name: String,
    pub date: String,
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct UserData {
    #[serde(default)]
    pub schedule: HashMap<String, Vec<Task>>,
    #[serde(default)]
    pub templates: HashMap<String, Vec<Task>>,
    #[serde(default)]
    pub exams: Vec<Exam>,
}

fn get_data_path(app_handle: &tauri::AppHandle) -> PathBuf {
    app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir")
        .join("user_data.json")
}

#[tauri::command]
fn get_user_data(app_handle: tauri::AppHandle) -> UserData {
    let path = get_data_path(&app_handle);
    if path.exists() {
        let content = fs::read_to_string(path).unwrap_or_default();
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        UserData::default()
    }
}

#[tauri::command]
fn save_user_data(app_handle: tauri::AppHandle, data: UserData) -> Result<(), String> {
    let path = get_data_path(&app_handle);
    let dir = path.parent().unwrap();
    if !dir.exists() {
        fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    }
    let content = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}

#[tauri::command]
fn minimize_window(window: tauri::Window) {
    window.minimize().unwrap();
}

#[tauri::command]
fn toggle_maximize(window: tauri::Window) {
    if window.is_maximized().unwrap() {
        window.unmaximize().unwrap();
    } else {
        window.maximize().unwrap();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_user_data,
            save_user_data,
            close_window,
            minimize_window,
            toggle_maximize
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
