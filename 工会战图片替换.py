import os
import re
import json

# 配置文件路径
CONFIG_FILE_PATH = 'j:\\桌面备份\\文档\\pcrone-p\\ghz-config-1.js'
# 工会战图片根目录
GHZ_IMAGE_ROOT = 'j:\\桌面备份\\文档\\pcrone-p\\工会战'
# 项目根目录
PROJECT_ROOT = 'j:\\桌面备份\\文档\\pcrone-p'

# 缩略图输出目录与参数
THUMB_ROOT = os.path.join(GHZ_IMAGE_ROOT, 'thumbs')
THUMB_MAX_WIDTH = 1800      # 缩略图最大宽度（页面展示用，原图仍用于点击放大）
THUMB_JPEG_QUALITY = 80

try:
    from PIL import Image
except ImportError:
    Image = None

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


def generate_thumbnail(src_path):
    """为单张原图生成页面用的 JPEG 缩略图，返回 (输出路径, 是否新生成)。

    规则：
    - 输出到 工会战/thumbs/<子目录>/<同名>.jpg
    - 宽度超过 THUMB_MAX_WIDTH 时等比缩小，否则保持原尺寸
    - 透明 PNG 合成到白色背景，避免转 JPEG 后发黑
    - 缩略图比原图新时跳过，避免重复处理
    """
    if Image is None:
        return None, False

    rel_path = os.path.relpath(src_path, GHZ_IMAGE_ROOT)
    out_path = os.path.join(THUMB_ROOT, os.path.splitext(rel_path)[0] + '.jpg')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    if os.path.exists(out_path) and os.path.getmtime(out_path) >= os.path.getmtime(src_path):
        return out_path, False

    with Image.open(src_path) as im:
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA')
            background = Image.new('RGB', im.size, (255, 255, 255))
            background.paste(im, mask=im.split()[-1])
            im = background
        else:
            im = im.convert('RGB')

        width, height = im.size
        if width > THUMB_MAX_WIDTH:
            new_height = max(1, round(height * THUMB_MAX_WIDTH / width))
            im = im.resize((THUMB_MAX_WIDTH, new_height), Image.LANCZOS)

        im.save(out_path, 'JPEG', quality=THUMB_JPEG_QUALITY, optimize=True, progressive=True)

    return out_path, True


def generate_thumbnails_for_dir(dir_path):
    """为指定子目录下的全部图片生成缩略图，返回 (生成数, 跳过数)。"""
    created = 0
    skipped = 0
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if not any(file.lower().endswith(ext) for ext in IMAGE_EXTENSIONS):
                continue
            src_path = os.path.join(root, file)
            out_path, is_new = generate_thumbnail(src_path)
            if out_path is None:
                continue
            if is_new:
                created += 1
            else:
                skipped += 1
    return created, skipped



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

    if Image is None:
        print('警告: 未安装 Pillow，无法生成缩略图；请先执行 pip install pillow')

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

            # 同步生成页面缩略图
            if Image is not None:
                created, skipped = generate_thumbnails_for_dir(dir_path)
                print(f'缩略图 {dir_name}: 新增 {created} 张，跳过 {skipped} 张')
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