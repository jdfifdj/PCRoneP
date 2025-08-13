import os
import re

# 定义文件夹路径和对应的数据键
folder_mapping = {
    "活动角色": "huodong",
    "卡池": "gachaPools",
    "六星": "sixStar",
    "图标": "activities",
    "专武": "specialWeapons"
}

# 获取当前工作目录
current_dir = os.getcwd()

# 创建imagePaths字典
image_paths = {}

# 遍历每个文件夹
for folder_name, key in folder_mapping.items():
    folder_path = os.path.join(current_dir, folder_name)
    
    # 检查文件夹是否存在
    if not os.path.exists(folder_path):
        print(f"警告: 文件夹 '{folder_path}' 不存在")
        image_paths[key] = []
        continue
    
    # 获取文件夹中的所有图片文件
    image_files = []
    for file_name in os.listdir(folder_path):
        # 检查文件扩展名是否为图片
        if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            # 构建相对路径
            relative_path = f"./{folder_name}/{file_name}"
            image_files.append(relative_path)
    
    # 按文件名排序
    image_files.sort()
    
    # 添加到imagePaths字典
    image_paths[key] = image_files

# 生成JavaScript代码
js_code = "const imagePaths = {\n"
for key, paths in image_paths.items():
    js_code += f"    {key}: [\n"
    for path in paths:
        js_code += f"        \"{path}\",\n"
    # 移除最后一个逗号
    if paths:
        js_code = js_code.rstrip(',\n') + '\n'
    js_code += "    ],\n"
# 移除最后一个逗号
js_code = js_code.rstrip(',\n') + '\n'
js_code += "};"

# 打印生成的代码
print("生成的imagePaths代码:")
print(js_code)

# 自动更新config.html文件
config_file = os.path.join(current_dir, "config.html")
if os.path.exists(config_file):
    # 读取config.html文件内容
    with open(config_file, "r", encoding="utf-8") as f:
        config_content = f.read()
    
    # 使用正则表达式替换所有的imagePaths定义
    # 匹配const imagePaths = {...}模式
    pattern = r'const imagePaths = \{[\s\S]*?\};'
    new_config_content = re.sub(pattern, js_code, config_content)
    
    # 写入修改后的内容
    with open(config_file, "w", encoding="utf-8") as f:
        f.write(new_config_content)
    
    print(f"\n已成功更新 {config_file} 文件中的imagePaths定义")
else:
    print(f"\n警告: 未找到 {config_file} 文件，无法自动更新")

# 保存生成的代码到文件
output_file = os.path.join(current_dir, "image_paths.js")
with open(output_file, "w", encoding="utf-8") as f:
    f.write(js_code)

print(f"代码已保存到 {output_file} 文件")

# 复制到剪贴板（可选）
try:
    import pyperclip
    pyperclip.copy(js_code)
    print("代码已复制到剪贴板")
except ImportError:
    print("如需自动复制到剪贴板，请安装pyperclip库: pip install pyperclip")