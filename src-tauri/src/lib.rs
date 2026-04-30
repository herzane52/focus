use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Task {
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub topic: String,
    #[serde(default)]
    pub questions: i32,
    #[serde(default)]
    pub note: String,
    #[serde(default)]
    pub completed: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Exam {
    #[serde(default)]
    pub name: String,
    #[serde(default)]
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
    let filename = if let Ok(val) = std::env::var("FOCUS_ENV") {
        if val == "test" {
            "user_data_test.json"
        } else if val == "dev" {
            "user_data_dev.json"
        } else {
            "user_data.json"
        }
    } else if cfg!(debug_assertions) {
        "user_data_dev.json"
    } else {
        "user_data.json"
    };

    let path = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir")
        .join(filename);
    
    println!("Data path: {:?}", path);
    path
}

#[tauri::command]
fn get_user_data(app_handle: tauri::AppHandle) -> UserData {
    let path = get_data_path(&app_handle);
    if path.exists() {
        match fs::read_to_string(&path) {
            Ok(content) => {
                match serde_json::from_str(&content) {
                    Ok(data) => data,
                    Err(e) => {
                        eprintln!("JSON parse hatası ({:?}): {}", path, e);
                        UserData::default()
                    }
                }
            }
            Err(e) => {
                eprintln!("Dosya okuma hatası ({:?}): {}", path, e);
                UserData::default()
            }
        }
    } else {
        println!("Veri dosyası bulunamadı, varsayılan oluşturuluyor: {:?}", path);
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
    fs::write(&path, content).map_err(|e| e.to_string())?;
    println!("Veri başarıyla kaydedildi: {:?}", path);
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
    // Linux grafik ve AppImage başlatma hatalarını gidermek için ortam değişkenlerini ayarla
    std::env::set_var("WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS", "1");

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
