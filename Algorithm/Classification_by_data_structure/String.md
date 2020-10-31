# 字符串相关问题



## 字符串全排列问题

### 1. [按字典序排列](https://www.nowcoder.com/practice/fe6b651b66ae47d7acce78ffdd9a96c7?tpId=188&tqId=36164&rp=1&ru=%2Factivity%2Foj&qru=%2Fta%2Fjob-code-high-week%2Fquestion-ranking)

**题目**：输入一个字符串，打印出该字符串中字符的所有排列。例如输入字符串abc，则输出由字符a，b，c所能排列出来的所有字符串abc，acb，bac，bca，cab和cba

**这题考察字符串的[全排列算法](https://blog.csdn.net/wzy_1988/article/details/8939140)**。

#### 思路1：递归

为什么能用递归？

**递归的特点**：

- 必须有可达到的终止条件，否则程序陷入死循环
- 子问题在规模上比原问题小
- 子问题可通过再次递归调用求解
- 子问题的解应能组合成整个问题的解



































