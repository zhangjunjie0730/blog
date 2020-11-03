# 动态规划系列

## 1. 概述和框架

**动态规划问题的一般形式就是求最值**。动态规划其实是运筹学的一种最优化方法，只不过在计算机问题上应用比较多，**比如说让你求最长递增子序列呀，最小编辑距离呀等等。**

求最值 → 核心问题就是：**穷举**。

但是动态规划的穷举有几个特点：

1. 一般穷举都会**存在「重叠子问题」**，暴力穷举效率低下。
2. 动态规划问题一定**具备「最优子结构」**
3. 只有列出**正确的「状态转移方程」**才能正确地穷举。

所以，以上提到的**重叠子问题**、**最优子结构**、**状态转移方程**就是动态规划三要素。**写出状态转移方程是最困难的**

辅助你思考状态转移方程的思路：

**明确 base case -> 明确「状态」-> 明确「选择」 -> 定义 dp 数组/函数的含义**。

```c++
# 初始化 base case
dp[0][0][...] = base
# 进行状态转移
for 状态1 in 状态1的所有取值：
    for 状态2 in 状态2的所有取值：
        for ...
            dp[状态1][状态2][...] = 求最值(选择1，选择2...)
```

下面用几道经典题来理解框架。

### 1.1 斐波那契数列

#### 1. 暴力递归

```js
function fib(n){
  if(n === 1 || n === 2) return 1;
  return fib(n -1) + fib(n - 2);
}
```

假设 n=20，画出递归树：

![image-20201101104400105](DynamicProgramming.assets/image-20201101104400105.png)

**递归算法的时间复杂度该怎么计算？就是用子问题个数 × 解决一个子问题的时间。**

首先，可以看到递归树中节点的总数为指数级别。子问题个数为 O(2^n)。

其次，题解中没有循环，只有一个加法，所以操作时间是 O(1)。

所以，整个时间复杂度就是二者相乘， O(2^n)，指数级别。

递归树低效的原因：比如 `f(18)` 被计算了两次，且 `f(18)` 这颗递归树体量巨大，多算一次很费劲。

所以要想办法解决动态规划问题的第一个性质：**重叠子问题**。

#### 2. 带备忘录的递归解法

即然耗时的原因是重复计算，那么我们可以造一个「备忘录」，每次算出某个子问题的答案后别急着返回，先记到「备忘录」里再返回；每次遇到一个子问题先去「备忘录」里查一查，如果发现之前已经解决过这个问题了，直接把答案拿出来用，不要再耗时去计算了。

一般使用一个数组充当这个「备忘录」，当然你也可以使用哈希表（字典），思想都是一样的。

```java
int fib(int N){
  if(N < 1) return 0;
  int[] memo = new int[N+1];
  return helper(memo, N);
}
int helper(int[] memo, int n){
  if(n == 1 || n==2) return 1;
  if(memo[n] != 0) return memo[n]; // 不是0说明存储了东西
  memo[n] = helper(memo, n-1) + helper(memo, n-2);
  return memo[n];
}
```

备忘录 `memo` ，记录了每一次递归的值。递归树被简化成了这个样子。

![image-20201101111600704](DynamicProgramming.assets/image-20201101111600704.png)

所以，实际上每个节点只计算了一次。所以时间复杂度变成了O(n)。

- 自顶向下：画递归树的时候是从上向下延伸，直至 `f(1)` 和 `f(2)` 这两个base case。然后逐层返回答案。
- 自底向上：我们直接从最底下，最简单，问题规模最小的 `f(1)` 和 `f(2)` 开始往上推，直到推到我们想要的答案 `f(20)`，这就是动态规划的思路，这也是为什么动态规划一般都脱离了递归，而是由循环迭代完成计算。

#### 3. DP 数组的迭代解法

有了上一步「备忘录」的启发，我们可以把这个「备忘录」独立出来成为一张表，就叫做 DP table 。**这张表上完成「自底向上」。**

![image-20201101112446839](DynamicProgramming.assets/image-20201101112446839.png)

```java
int fib(int N){
  if(N == 0) {
      return 0;
  }else if(N == 1 || N == 0){
      return 1;
  };
  int[] dp = new int[N+1];
  dp[1] = dp[2] = 1; //base case
  for(int i = 3;i <= N; i++){
		dp[i] = dp[i-1] + dp[i-2];
  };
  return dp[N];
}
```

为啥叫「状态转移方程」？其实就是为了听起来高端。你把 `f(n)` 想做一个状态 `n`，这个状态 `n` 是由状态 `n - 1` 和状态 `n - 2` 相加转移而来，这就叫状态转移。

**动态规划问题最困难的就是写出这个暴力解，即状态转移方程**。只要写出暴力解，优化方法无非是用备忘录或者 DP table，再无奥妙可言。

**这道题还能进行优化的点：**这题状态转移方程只和前两个状态相关，所以不需要那么长的 DP table 来存储所有的状态，只需要存储之前的两个状态就行，空间复杂度降为 O(1)：

```java
int fib(int n){
  if(n == 0) return 0;
  if(n==2||n==1) return 1;
  int prev = 1,curr = 1;
  for(int i=3;i<=n;i++){
    int sum = prev + curr;
    prev = curr;
    curr = sum;
  }
  return curr;
}
```

斐波那契数列的例子严格来说不算动态规划，因为没有涉及求最值，以上旨在说明重叠子问题的消除方法，演示得到最优解法逐步求精的过程。下面，看第二个例子，凑零钱问题。

### 1.2 凑零钱问题

**题目**：给你 `k` 种面值的硬币，面值分别为 `c1, c2 ... ck`，每种硬币的数量无限，再给一个总金额 `amount`，问你**最少**需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1 。

#### 1. 暴力递归

首先，这个问题是动态规划问题，因为它具有「最优子结构」的。**要符合「最优子结构」，子问题间必须互相独立**。为什么这题属于子问题互相独立呢？比如你想求 `amount = 11` 时的最少硬币数（原问题），如果你知道凑出 `amount = 10` 的最少硬币数（子问题），你只需要把子问题的答案加一（再选一枚面值为 1 的硬币）就是原问题的答案。因为硬币的数量是没有限制的，所以子问题之间没有相互制，是互相独立的。

比如 `amount = 11, coins = {1,2,5}` 时，画出递归树看看：

![image-20201101135841951](DynamicProgramming.assets/image-20201101135841951.png)

**重点：列出正确的状态转移方程。**

1. **base case**：目标金额 `amount` 为 0 时算法返回 0
2. **确定「状态」：也就是原问题和子问题中会变化的变量**。唯一的「状态」就是目标金额 `amount`。
3. **确定「选择」：也就是导致「状态」产生变化的行为**。目标金额为什么变化呢，因为你在选择硬币，你每选择一枚硬币，就相当于减少了目标金额。所以说所有硬币的面值，就是你的「选择」。
4. **明确** **`dp`** **函数/数组的定义**。`dp(n)` 的定义：输入一个目标金额 `n`，返回凑出目标金额 `n` 的最少硬币数量。

`dp(n)` 状态转移方程思路如下：

![image-20201101135655156](DynamicProgramming.assets/image-20201101135655156.png)

**伪码：**

```c++
def coinChange(coins: List[int], amount: int):

		# 定义：要凑出金额 n，至少要 dp(n) 个硬币
    def dp(n):
        # base case
        if n == 0: return 0
        if n < 0: return -1
        # 求最小值，所以初始化为正无穷
        res = float('INF')
        # 做选择，选择需要硬币最少的那个结果
        for coin in coins:
            subproblem = dp(n - coin)
            # 子问题无解，跳过
            if subproblem == -1: continue
            res = min(res, 1 + subproblem)

        return res if res != float('INF') else -1
		# 题目要求的最终结果是 dp(amount)
    return dp(amount)
```



JS 代码（在题解里提交会超时），所以必须去优化重复的计算。

```java
let res = Infinity;
var coinChange = function (coins, amount) {
  return dp(amount);
  function dp(amount) {
    // base case
    if (amount == 0) return 0;
    if (amount < 0) return -1;
    for (let coin of coins) {
      let subProblem = dp(amount - coin);
      if (subProblem == -1) continue; // 说明此路不通，退出这次循环
      res = Math.min(res, subProblem + 1);
    }
    return res != Infinity ? res : -1;
  }
};

```

分析以下复杂度。每个子问题都要有一次 for 循环，所以子问题的时间复杂度是 O(n)，但是递归树的个数实际上是 O(2^n)，所以 O(n) × O(2^n) = O(2^n) 的复杂度。

#### 2. 带备忘录的递归解法

**只需要加一个memo哈希表就好。**

```js
var coinChange = function(coins, amount) {
  let memoMap = {};
  return dp(amount);
  function dp(amount){
    // 先用备忘录查看是否已经计算过
    if(memoMap[amount]) return memoMap[amount];
    // base case
    if(amount == 0) return 0;
    if(amount < 0) return -1;
    let res = Infinity;
    for(let coin of coins){
      let subProblem = dp(amount - coin);
      if(subProblem == -1) continue; // 说明此路不通，退出这次循环
      res = Math.min(res, subProblem + 1);
    }
    memoMap[amount] = (res !== Infinity ? res : -1);
    return memoMap[amount];
  }
};
```

分析以下复杂度，这一次递归树的节点数量立马减少到每个节点只用计算一次所以就是 O(n)，处理问题仍然是 O(n)，所以是O(n)复杂度。

#### 3. DP数组自下而上迭代

其实可以看作问题的逆向思维。`dp` 数组的定义和刚才 `dp` 函数类似，也是把「状态」，也就是 `amount` 作为变量。不过 `dp` 函数体现在函数参数，而 `dp` 数组体现在数组索引。

**可以这样理解，我们不要从头看起。随便选择比如下标 11 的索引位置。从这个位置出发，为了最小，我可以这么想：**

在 11 之前的位置找到 `[1, 2, 5]` 这三种硬币加一次就能达到 `amount = 11` ，这样才是最小的次数。所以索引位置分别为 `[11-1, 11-2, 11-5]` ，只需要找到这三个里面次数的最小值 + 1，就是 11 位置上的最小值！

![image-20201101153113497](DynamicProgramming.assets/image-20201101153113497.png)



```js
import java.util.Arrays;
class Solution {
  public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for(int i = 0;i<dp.length;i++){
      for(int coin : coins){
        if(i-coin < 0) continue;
        dp[i] = Math.min(dp[i], dp[i-coin] + 1);
      }
    }
    return dp[amount] == amount + 1 ? -1 : dp[amount];
  }
}
```



## 2. 进阶解析

### 3.1 最优子结构详解

首先，要明确之前说的：**想满足最优子结，子问题之间必须互相独立**。

举例 1：学校有 10 个班，已知每个班的最高分，求全校的最高成绩。这个问题**符合最优子结构**。子问题是**每个班的最优成绩**，是相互独立的。

举例 2：学校有 10 个班，已知每个班的最大分数差（只知道差值），求全校学生的最大分数差。这个问题**不符合最优子结构**。因为不独立，最大分数差可能跨班，所以每个班的分数差不是独立的子问题。

找最优子结构的过程，其实就是证明状态转移方程正确性的过程，方程符合最优子结构就可以写暴力解了，写出暴力解就可以看出有没有重叠子问题了，**有则优化，无则 OK**。这也是套路，经常刷题的朋友应该能体会。

#### 例题

题目：

![image-20201101173615731](DynamicProgramming.assets/image-20201101173615731.png)

我们穷举呗，对于每次按键，我们可以穷举四种可能，**很明显就是一个动态规划问题**。

##### 思路一：

分析一下：**对于动态规划问题，首先要明白有哪些「状态」，有哪些「选择」**。

- 「选择」：4 种，就是题目中提到的四个按键，分别是`A`、`C-A`、`C-C`、`C-V`（`Ctrl`简写为`C`）。
- 「状态」：**或者换句话说，我们需要知道什么信息，才能将原问题分解为规模更小的子问题**？

你看我这样定义三个状态行不行：第一个状态是剩余的按键次数，用 `n `表示；第二个状态是当前屏幕上字符 A 的数量，用 `a_num `表示；第三个状态是剪切板中字符 A 的数量，用 `copy `表示。

所以 base case：当剩余次数 `n `为 0 时，`a_num` 就是我们想要的答案。

```c++
dp(n - 1, a_num + 1, copy),    # A
解释：按下 A 键，屏幕上加一个字符
同时消耗 1 个操作数

dp(n - 1, a_num + copy, copy), # C-V
解释：按下 C-V 粘贴，剪切板中的字符加入屏幕
同时消耗 1 个操作数

dp(n - 2, a_num, a_num)        # C-A C-C
解释：⭐全选和复制必然是联合使用的，
剪切板中 A 的数量变为屏幕上 A 的数量
同时消耗 2 个操作数
```







### 3.2 dp 数组的遍历方向

我相信读者做动态规划问题时，肯定会对 `dp` 数组的遍历顺序有些头疼。我们拿二维 `dp` 数组来举例，有时候我们是正向遍历：

```c++
int[][] dp = new int[m][n];
for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        // 计算 dp[i][j]
```

有时候我们反向遍历：

```c++
for (int i = m - 1; i >= 0; i--)
    for (int j = n - 1; j >= 0; j--)
        // 计算 dp[i][j]
```

有时候可能会斜向遍历：

```c++
// 斜着遍历数组
for (int l = 2; l <= n; l++) {
    for (int i = 0; i <= n - l; i++) {
        int j = l + i - 1;
        // 计算 dp[i][j]
    }
}
```

你只要把住两点就行了：

**1. 遍历的过程中，所需的状态必须是已经计算出来的**。

**2. 遍历的终点必须是存储结果的那个位置**。



























