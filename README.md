# CSARCH2 - CASE STUDY #1 

## Wesbite link: https://miraitee.github.io/FA-CacheSim/

###  GROUP 6 - Cache Machine comparison between Full Associative Least Recently Used vs Full Associative Most Recently Used.
The project's main idea is to compare the stats of the LRU and MRU algorithm and to allow visualization of the mechanism behind it.
Tracking the recency is very crucial for Full Associative.

Members:
- Borromeo, Anton Miguel
- Dela Cruz, Mirai
- Reyes, Nicos
- Roldan, Beatrice
- Ruiz, Joseph Benjamin

AI Disclosure
- Usage of AI is declared on the assistance of UI for the project's implementation. 
Website however is still manuevered by the group in terms of dictating the elements to be used and where. 

Report:

Given the specifications, the user may adjust for the configurations at the bottom left corner such as. 
- Block Size (words)
- # of Cache Blocks
- Read Policy (Load-through/Non-load-through)
- Sequence based on specs ()
- a. Sequential sequence: Access up to 2n cache blocks. Repeat the sequence two times.
- b. Mid-repeat blocks: Start at block 0 to n-1, then repeat the sequence up to 2n-1 twice. Afterward, reverse the sequence pattern.
- c. Random sequence: Generate a random sequence of 64 block accesses (block indices must be within the 0 to 1023 range)

The user can choose whether to do a step by step or a snapshot. Once set, the user may press the play button to see it in action.

Dropdown boxes were used to avoid the hassle of
prompting the user to input anything not power of 2. 

Statistical outputs are as of follow:
1.) Total memory access count; (sidelined into the player to compare current/total)
2) Cache hit count; 
3) Cache miss count; 
4) Cache hit rate; 
5) Cache miss rate; 
6) Average Memory Access Time; 
7) Total memory access time

