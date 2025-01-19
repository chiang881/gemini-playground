/**
 * 关键词检测器类
 */
export class KeywordDetector {
    constructor() {
        this.keywords = [];
        this.detectedKeywords = new Set();
        this.resultsContainer = document.getElementById('keyword-results');
        this.keywordsInput = document.getElementById('keywords-input');
        
        console.log('KeywordDetector 初始化');
        
        // 从localStorage加载保存的关键词
        const savedKeywords = localStorage.getItem('keywords');
        if (savedKeywords) {
            this.keywordsInput.value = savedKeywords;
            this.keywords = this.processKeywords(savedKeywords);
            console.log('从localStorage加载关键词:', this.keywords);
        }

        // 监听关键词输入变化
        this.keywordsInput.addEventListener('change', () => {
            console.log('关键词输入变化:', this.keywordsInput.value);
            this.updateKeywords(this.keywordsInput.value);
        });
    }

    /**
     * 处理关键词列表
     * @param {string} keywordsString - 逗号分隔的关键词字符串
     * @returns {Array<{keyword: string, regex: RegExp}>} 处理后的关键词数组
     */
    processKeywords(keywordsString) {
        return keywordsString
            .split(',')
            .map(k => k.trim())
            .filter(k => k)
            .map(keyword => ({
                keyword,
                // 创建一个不区分大小写的正则表达式，支持单词边界
                regex: new RegExp(`\\b${keyword}\\b`, 'i')
            }));
    }

    /**
     * 更新关键词列表
     * @param {string} keywordsString - 逗号分隔的关键词字符串
     */
    updateKeywords(keywordsString) {
        this.keywords = this.processKeywords(keywordsString);
        localStorage.setItem('keywords', keywordsString);
        console.log('更新关键词列表:', this.keywords);
        this.detectedKeywords.clear();
        this.resultsContainer.innerHTML = '';
    }

    /**
     * 检测文本中的关键词
     * @param {string} text - 要检测的文本
     */
    detect(text) {
        if (!text || !this.keywords.length) {
            console.log('无效的文本或关键词为空:', { text, keywords: this.keywords });
            return;
        }

        console.log('开始检测关键词:', { text, keywords: this.keywords });
        
        // 将文本分割成单词进行检测
        const words = text.split(/\s+/);
        console.log('分词结果:', words);

        for (const {keyword, regex} of this.keywords) {
            // 检查整个文本
            if (regex.test(text) && !this.detectedKeywords.has(keyword)) {
                console.log('检测到关键词:', keyword);
                this.detectedKeywords.add(keyword);
                this.showKeyword(keyword);
                continue;
            }

            // 检查单个单词
            for (const word of words) {
                if (regex.test(word) && !this.detectedKeywords.has(keyword)) {
                    console.log('在单词中检测到关键词:', { word, keyword });
                    this.detectedKeywords.add(keyword);
                    this.showKeyword(keyword);
                    break;
                }
            }
        }
    }

    /**
     * 在界面上显示检测到的关键词
     * @param {string} keyword - 检测到的关键词
     */
    showKeyword(keyword) {
        console.log('显示关键词:', keyword);
        const keywordElement = document.createElement('div');
        keywordElement.classList.add('keyword-item');
        keywordElement.textContent = keyword;
        this.resultsContainer.appendChild(keywordElement);
        console.log('关键词元素已添加到容器');
    }

    /**
     * 清除检测结果
     */
    clear() {
        console.log('清除检测结果');
        this.detectedKeywords.clear();
        this.resultsContainer.innerHTML = '';
    }
} 