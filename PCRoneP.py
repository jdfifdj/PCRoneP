import asyncio
import time
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright

async def capture_website(url: str, save_path: str):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        try:
            await page.goto(url, timeout=60000)
            await page.wait_for_load_state("networkidle")
            
            time.sleep(1)

            # 截图保存
            await page.screenshot(path=save_path, full_page=True)
            
            # 添加时间戳并压缩
            with Image.open(save_path) as img:
                # 创建绘图对象
                draw = ImageDraw.Draw(img)
                
                
                # 压缩保存
                img.save(save_path, quality=70, optimize=True)
            
            print(f"截图已成功保存至：{save_path}")
            return True
        except Exception as e:
            print(f"截图失败：{str(e)}")
            return False
        finally:
            await browser.close()

# 使用示例
if __name__ == "__main__":
    target_url = r"C:\Users\Administrator\Desktop\PCRoneP\PCRoneP.html"
    output_path = r"C:\Users\Administrator\Desktop\bot\HoshinoBot\res\img\xqa\img\21B42C832D1F09D2650AE87AEF9EE3E8.png"  # 使用原始字符串避免转义问题
    asyncio.run(capture_website(target_url, output_path))