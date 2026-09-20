# -*- coding: utf-8 -*-
"""
顺诚AI工作平台 · 对比度门禁前置处理
--------------------------------------------------
contrast_check.py 只扫描 HTML 内联的 <style> 块，
本站样式已抽到 assets/theme.css，需先内联再送检。

用法：
    python _tools/check_contrast.py
    退出码 0 = 全部通过
"""
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECKER = r"C:\Users\Lenovo\.workbuddy\tools\contrast_check.py"
PY = sys.executable

PAGES = ["index.html", "kitchen.html", "bathroom.html", "livingroom.html", "bedroom.html"]


def inline_css(html_path):
    """把 <link rel=stylesheet> 替换为 <style>...</style>，返回新 HTML 文本。"""
    html = open(html_path, encoding="utf-8").read()

    def repl(m):
        href = m.group(1)
        css_path = os.path.join(ROOT, href)
        if not os.path.isfile(css_path):
            print(f"    [警告] 引用的样式文件不存在：{href}")
            return m.group(0)
        css = open(css_path, encoding="utf-8").read()
        return f"<style>\n{css}\n</style>"

    return re.sub(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\'][^>]*/?>',
                  repl, html, flags=re.I)


def main():
    tmpdir = tempfile.mkdtemp(prefix="sc_contrast_")
    targets = []
    for p in PAGES:
        src = os.path.join(ROOT, p)
        if not os.path.isfile(src):
            continue
        out = os.path.join(tmpdir, p)
        open(out, "w", encoding="utf-8").write(inline_css(src))
        targets.append(out)

    if not os.path.isfile(CHECKER):
        print(f"未找到自检脚本：{CHECKER}")
        return 2

    print("已内联 assets/theme.css，送检文件：")
    for t in targets:
        print("   ", os.path.basename(t))
    print("-" * 60)

    r = subprocess.run([PY, CHECKER] + targets)
    print("-" * 60)
    print("退出码：", r.returncode, "（0 = 通过）")
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
