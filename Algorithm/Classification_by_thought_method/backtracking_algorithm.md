# 套路总结

**解决一个回溯问题，实际上就是一个决策树的遍历过程**。只需要思考3个问题：

1、路径：也就是已经做出的选择。

2、选择列表：也就是你当前可以做的选择。

3、结束条件：也就是到达决策树底层，无法再做选择的条件。

回溯算法的框架：

```js
let results = [];
function backtrack(path, choiceList){
  if (满足结束条件){
    results.push(path);
    return
  };
  for(choose of choiceList){
    做选择；
    backtrack(path, choiceList)
    撤销选择
  }
}
```

**其核心就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」**。



# 经典题

## 1. 全排列问题

`[1, 2, 3]` 进行枚举。

**思路**：我们可以画出一颗回溯树：

![image-20201111103201559](Backtracking_Algorithm.assets/image-20201111103201559.png)



所以自然而然**变成了遍历树的问题**！**我们把这棵树称为决策树**。为什么要叫决策树呢？比如我们站在红色节点上，就在做决策是选择 1 还是 3 。为什么只能选择 1 和 3 呢，因为 2 的上一级已经做好决定了，全排列不允许重复。

所以在这里：

- **2 就是路径path，用来记录你已经做过的选择**
- **[1, 3] 就是选择列表 choiceList，表示当前你可以做的选择**
- **结束条件就是遍历到这颗树的底层，即可以选择的列表为空时**

**我们定义的** **`backtrack`** **函数其实就像一个指针，在这棵树上游走，同时要正确维护每个节点的属性，每当走到树的底层，其「路径」就是一个全排列**。

代码如下：

```js
var permute = function(nums) {
  let res = [];
  let track = new Set();
  backtrack(nums, track);
  return res;
  
  function backtrack(nums, track){ // 路径 选择列表
    if(nums.length === track.size){
      res.push([...track]);
      return;
    }
    for(let i=0;i<nums.length;i++){
      if(track.has(nums[i])) continue;
      track.add(nums[i]);
      backtrack(nums, track);
      track.delete(nums[i]);
    }
  }
};
```

注意我的路径列表选择用 `Set()` 来定义，能方便查询和删除操作。

**回溯算法的一个特点：不像动态规划存在重叠子问题可以优化，回溯算法就是纯暴力穷举，复杂度一般都很高**。



## 2. N 皇后问题

[LeetCode51](https://leetcode-cn.com/problems/n-queens/)

这个问题很经典了，简单解释一下：给你一个 N×N 的棋盘，让你放置 N 个皇后，使得它们不能互相攻击。

PS：皇后可以攻击同一行、同一列、左上左下右上右下四个方向的任意单位。





# 排序、组合、子集问题合集

## 1. 子集

**题目：**

![image-20201111154849672](Backtracking_Algorithm.assets/image-20201111154849672.png)

比如输入 `nums = [1,2,3]`，你的算法应输出 8 个子集，包含空集和本身，顺序可以不同：

```js
[ [],[1],[2],[3],[1,3],[2,3],[1,2],[1,2,3] ]
```

可以发现这样的规律：如果 `A = subset([1, 2])` ，那么subset(`[1, 2, 3]`) = A + [A[i].add(3) for i = 1..len(A)]。这就是典型的递归。

用回溯的写法：

```js
var subsets = function(nums) {
  let res = [];
  backtrack(0,[])

  function backtrack(start,track){
    res.push([...track]);
    for(let i=start;i<nums.length;i++){
      track.push(nums[i]);
      backtrack(i+1, track);
      track.pop()
    }
  } 
  return res;
};
```





























