import numpy as np

n, m = map(int, input("点数和边数: ").split())
print(n, m)

E = np.zeros((n, n))

for i in range(m):
    u, v = map(int, input("u->v: ").split())
    E[u - 1][v - 1] = 1

print(E)

C = np.sum(E, axis=1)
print(C)

PR = np.zeros((1, n))
print(PR)

it_num = int(input("迭代次数: "))
d = float(input("平滑因子: "))
const = (1 - d) / n

for i in range(it_num):
    PR = np.dot(PR / C, E) * d + const
    print(PR)

print("final res: " + str(PR))