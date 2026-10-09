import unittest
from pathlib import Path

from compile_moon_states import build, is_3do


class MoonStatesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = build(Path('outputs/moon'))

    def test_no_3do_controllers(self):
        for variants in self.bundle['stateVariants'].values():
            for state in variants:
                for controller in state['controllers']:
                    text = str(controller['params']) + str(controller['triggerall']) + str(controller['triggers'])
                    self.assertNotIn('3DO', text.upper())
        self.assertTrue(any(item['reason'] == '3DO excluded by author'
                            for item in self.bundle['excludedControllers']))

    def test_hardware_gate(self):
        self.assertTrue(is_3do({'entries': [{'text': 'triggerall = var(50) = 1'}]}))
        self.assertFalse(is_3do({'entries': [{'text': 'triggerall = var(50) = 0'}]}))
        self.assertEqual(self.bundle['hardware'], ['snes', 'saturn'])

    def test_duplicate_definitions_not_merged(self):
        variants = self.bundle['stateVariants']['801']
        self.assertEqual(len(variants), 2)
        self.assertEqual(variants[0]['anim'], '801')
        self.assertEqual(variants[1]['anim'], '800')
        first_types = {item['type'] for item in variants[0]['controllers']}
        second_types = {item['type'] for item in variants[1]['controllers']}
        self.assertIn('TargetBind', first_types)
        self.assertNotIn('TargetBind', second_types)
        self.assertIn('HitDef', second_types)
        self.assertNotIn('HitDef', first_types)

    def test_source_normals_preserved(self):
        for state_id in (200, 210, 230, 240, 400, 410, 430, 440, 600, 610, 630, 640):
            state = self.bundle['stateVariants'][str(state_id)][0]
            self.assertTrue(any(controller['type'] == 'HitDef' for controller in state['controllers']))
            self.assertEqual(state['source']['file'], 'moon.cns')
        hitdef = next(item for item in self.bundle['stateVariants']['200'][0]['controllers']
                      if item['type'] == 'HitDef')
        self.assertEqual(hitdef['params']['damage'].replace(' ', ''), 'Cond(anim=205,30,20),0')

    def test_unfinished_branches_excluded(self):
        self.assertNotIn('830', self.bundle['collision'])
        self.assertFalse(any(item['params'].get('value') == '10612'
                             for item in self.bundle['stateVariants']['823'][0]['controllers']))
        self.assertFalse(self.bundle['runtimeEnabled'])

    def test_human_ai_commands_separated(self):
        self.assertGreater(len(self.bundle['playerCommands']), 0)
        self.assertGreater(len(self.bundle['aiCommands']), 0)
        for controller in self.bundle['playerCommands']:
            self.assertTrue(any('!AILevel' in expression for expression in controller['triggerall']))


if __name__ == '__main__':
    unittest.main()
