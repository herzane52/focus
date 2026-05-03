// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Ubuntu/Debian tabanlı sistemlerde EGL/DMABUF başlatması başarısız olduğunda
    // pencere görünmez hale gelir (transparent: true ile birleşince).
    // WebKit başlamadan ÖNCEsini burada ayarlıyoruz — run() içinde ayarlamak çok geç.
    #[cfg(all(target_os = "linux", not(debug_assertions)))]
    {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    focus_app_lib::run()
}
