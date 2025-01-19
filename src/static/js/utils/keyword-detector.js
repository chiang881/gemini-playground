/**
 * 关键词检测器类
 */
export class KeywordDetector {
    constructor() {
        this.keywords = [];
        this.detectedKeywords = new Set();
        this.resultsContainer = document.getElementById('keyword-results');
        this.keywordsInput = document.getElementById('keywords-input');
        
        // 从localStorage加载保存的关键词
        const savedKeywords = localStorage.getItem('keywords');
        if (savedKeywords) {
            this.keywordsInput.value = savedKeywords;
            this.keywords = savedKeywords.split(',').map(k => k.trim()).filter(k => k);
        }

        // 监听关键词输入变化
        this.keywordsInput.addEventListener('change', () => {
            this.updateKeywords(this.keywordsInput.value);
        });
    }

    /**
     * 更新关键词列表
     * @param {string} keywordsString - 逗号分隔的关键词字符串
     */
    updateKeywords(keywordsString) {
        this.keywords = keywordsString.split(',').map(k => k.trim()).filter(k => k);
        localStorage.setItem('keywords', keywordsString);
        this.detectedKeywords.clear();
        this.resultsContainer.innerHTML = '';
    }

    /**
     * 检测文本中的关键词
     * @param {string} text - 要检测的文本
     */
    detect(text) {
        if (!text || !this.keywords.length) return;

        for (const keyword of this.keywords) {
            if (text.toLowerCase().includes(keyword.toLowerCase()) && !this.detectedKeywords.has(keyword)) {
                this.detectedKeywords.add(keyword);
                this.showKeyword(keyword);
            }
        }
    }

    /**
     * 在界面上显示检测到的关键词
     * @param {string} keyword - 检测到的关键词
     */
    showKeyword(keyword) {
        const keywordElement = document.createElement('div');
        keywordElement.classList.add('keyword-item');
        keywordElement.textContent = keyword;
        this.resultsContainer.appendChild(keywordElement);
    }

    /**
     * 清除检测结果
     */
    clear() {
        this.detectedKeywords.clear();
        this.resultsContainer.innerHTML = '';
    }
} 