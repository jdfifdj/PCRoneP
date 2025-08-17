import os
import re
import json

# 配置文件路径
CONFIG_FILE_PATH = 'j:\\桌面备份\\文档\\pcrone-p\\ghz-config.js'
# 工会战图片根目录
GHZ_IMAGE_ROOT = 'j:\\桌面备份\\文档\\pcrone-p\\工会战'

# 子文件夹与配置数组的映射关系
dir_to_array_map = {
    'd1': 'd1Images',
    'd2': 'd2Images',
    'd3': 'd3Images',
    'd4': 'd4Images',
    'd5': 'd5Images',
    'set刀': 'd6Images'
}

# 支持的图片扩展名
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']


def read_config_file():
    """读取配置文件内容，处理JavaScript对象格式"""
    with open(CONFIG_FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # 提取配置对象部分
        start = content.find('const GHZconfigData = {') + len('const GHZconfigData = ')
        end = content.find('};', start)
        config_str = content[start:end+1]
        
        # 处理JavaScript对象中的末尾逗号问题
        config_str = re.sub(r',\s*}', '}', config_str)
        config_str = re.sub(r',\s*\]', ']', config_str)
        
        # 解析为JSON
        try:
            config_data = json.loads(config_str)
        except json.JSONDecodeError as e:
            print(f'JSON解析错误: {e}')
            print(f'处理后的配置字符串: {config_str}')
            raise
        
        return config_data, content


def get_image_files(dir_path):
    """获取目录下所有图片文件"""
    image_files = []
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if any(file.lower().endswith(ext) for ext in IMAGE_EXTENSIONS):
                # 计算相对路径
                relative_path = os.path.relpath(os.path.join(root, file), 'j:\\桌面备份\\文档\\pcrone-p')
                # 将Windows路径分隔符替换为Unix风格
                relative_path = relative_path.replace('\\', '/')
                image_files.append('./' + relative_path)
    return image_files


def update_config():
    # 读取配置文件
    config_data, original_content = read_config_file()

    # 遍历所有子文件夹
    for dir_name, array_name in dir_to_array_map.items():
        dir_path = os.path.join(GHZ_IMAGE_ROOT, dir_name)
        if os.path.exists(dir_path):
            # 获取图片文件列表
            image_files = get_image_files(dir_path)
            # 更新配置数据
            if image_files:
                config_data[array_name] = image_files
                print(f'更新 {array_name}: 找到 {len(image_files)} 张图片')
            else:
                print(f'警告: 文件夹 {dir_path} 中未找到图片文件')
        else:
            print(f'警告: 文件夹 {dir_path} 不存在')

    # 生成新的配置内容
    new_config_json = json.dumps(config_data, ensure_ascii=False, indent=2)
    
    # 构建替换内容
    new_content = original_content.replace(
        'const GHZconfigData = {' + original_content[original_content.find('const GHZconfigData = {') + len('const GHZconfigData = {'):original_content.find('};', original_content.find('const GHZconfigData = {'))] + '};',
        'const GHZconfigData = ' + new_config_json + ';'
    )

    # 写入更新后的配置文件
    with open(CONFIG_FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f'配置文件已更新: {CONFIG_FILE_PATH}')


if __name__ == '__main__':
    update_config()