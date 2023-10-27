

const fetch = require('node-fetch');

get = async (url) => {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (e) {
        return { success: false, error: e };
    }
}

const or = (a, b) => (a === undefined ? b : a);

post = async (url, body) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (e) {
        return { success: false, error: e };
    }
}


const defaultServer = "https://emkc.org";

const piston = (opts = {}) => {
    const server = String(opts.server || defaultServer).replace(/\/$/, '');
    const store = {};

    const api = {

        async runtimes() {
            if (store.runtimes) {
                return store.runtimes;
            }
            const suffix = (server === defaultServer)
                ? '/api/v2/piston/runtimes'
                : '/api/v2/runtimes';
            const url = `${server}${suffix}`;
            const runtimes = await get(url);
            if (runtimes && runtimes.success !== false) {
                store.runtimes = runtimes;
            }
            return runtimes;
        },

        async execute(argA, argB, argC) {
            const runtimes = await api.runtimes();
            if (runtimes.success === false) {
                return runtimes;
            }

            const config = typeof argA === 'object' ? argA : typeof argB === 'object' ? argB : argC || {};
            let language = (typeof argA === 'string') ? argA : undefined;
            language = language || config.language;
            const code = typeof argB === 'string' ? argB : undefined;
            const latestVersion = (runtimes.filter(n => n.language === language).sort((a, b) => {
                return a.version > b.version ? -1 : b.version > a.version ? 1 : 0;
            })[0] || {}).version;

            const boilerplate = {
                "language": language,
                "version": config.version || latestVersion,
                "files": or(config.files, [{
                    "content": code
                }]),
                "stdin": or(config.stdin, ""),
                "args": or(config.args, ["1", "2", "3"]),
                "compile_timeout": or(config.compileTimeout, 10000),
                "run_timeout": or(config.runTimeout, 3000),
                "compile_memory_limit": or(config.compileMemoryLimit, -1),
                "run_memory_limit": or(config.runMemoryLimit, -1)
            }

            const suffix = (server === defaultServer)
                ? '/api/v2/piston/execute'
                : '/api/v2/execute';
            const url = `${server}${suffix}`;
            return await post(url, boilerplate);
        }
    }

    return api;
}

module.exports = piston;

// const client = piston();

// client.execute('python', `class Solution:
//     def fourSum(self, nums, target):
//         n = len(nums)
//         nums.sort()
//         res = []

//         for i in range(n-3):
//             # avoid the duplicates while moving i
//             if i > 0 and nums[i] == nums[i - 1]:
//                 continue
//             for j in range(i+1, n-2):
//                 # avoid the duplicates while moving j
//                 if j > i + 1 and nums[j] == nums[j - 1]:
//                     continue
//                 lo = j + 1
//                 hi = n - 1
//                 while lo < hi:
//                     temp = nums[i] + nums[j] + nums[lo] + nums[hi]
//                     if temp == target:
//                         res.append([nums[i], nums[j], nums[lo], nums[hi]])

//                         # skip duplicates
//                         while lo < hi and nums[lo] == nums[lo + 1]:
//                             lo += 1
//                         lo += 1
//                         while lo < hi and nums[hi] == nums[hi - 1]:
//                             hi -= 1
//                         hi -= 1
//                     elif temp < target:
//                         lo += 1
//                     else:
//                         hi -= 1
//         return res

// # Example usage
// if __name__ == "__main__":
//     nums = [1, 0, -1, 0, -2, 2]
//     target = 0
//     solution = Solution()
//     result = solution.fourSum(nums, target)
//     print(result)
// `).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// });
