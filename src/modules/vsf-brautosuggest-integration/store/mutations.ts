import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_BR_AUTOSUGGEST] (state, { br_autosuggest }) {
    state.brAutosuggestState = br_autosuggest
  },
  [types.SET_BR_RANGES] (state, { br_ranges }) {
    state.brRangesState = br_ranges
  },
  [types.SET_BR_SUGGESTIONS] (state, { br_suggestion }) {
    state.brSuggestionState = br_suggestion
  }
}
