# CNS/ZSS Compatibility Preflight — 0.19 M1

LOCKED rule: before implementing/importing any new character, start from its DEF and scan every referenced battle file. Compare all discovered expression/trigger/controller/CMD/ZSS syntax against compatibility_registry.json. NEW, UNSUPPORTED, PARTIAL, or MISSING requirements must be surfaced before character runtime work.

Files:
- character_compat_scan.py — reusable DEF-driven scanner
- compatibility_registry.json — global engine compatibility registry
- venus_compatibility_matrix_v1.json — current Venus baseline and M1 acceptance tests

Important: the current GitHub prototype snapshot does not include Venus DEF/CMD/helper state files. Therefore Venus Matrix V1 records the three verified sources currently available in the repo. When the full Venus character folder is supplied to the scanner, it must regenerate the matrix from DEF references before Venus is declared fully preflighted.

0.19 M1 implementation target:
Tokenizer -> Expression AST -> Evaluator -> triggerall/triggerN grouping -> generic controller registry.
First generic controllers: CtrlSet, ChangeState, ChangeAnim, VelSet, VelAdd, VelMul, PosSet, PosAdd, StateTypeSet, VarSet, VarAdd.
