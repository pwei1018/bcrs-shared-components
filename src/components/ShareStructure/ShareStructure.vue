<template>
  <v-card flat id="share-structure">

    <confirm-dialog
      ref="confirm"
      attach="#share-structure"
    />

    <!-- Summary Section -->
    <div id="share-summary">
      <!-- Summary Header -->
      <div class="share-summary-header">
        <v-icon color="app-dk-blue">mdi-sitemap</v-icon>
        <label class="share-summary-header-title"><strong> Share Structure</strong></label>
      </div>
    </div>

    <!-- Instructional Text -->
    <div class="share-info-container info-text pt-6 px-4">
      Your share structure contains a class or series of shares with special rights or restrictions. You must have
      passed a resolution or have a court order to change your share structure. <strong>Note:</strong> All changes must
      have the same Resolution or Court Order Date. If you need to enter changes that occurred on multiple dates you
      must file and pay for each change separately.
    </div>

    <!-- Add Buttons -->
    <div class="btn-container py-6 px-4">
      <v-btn
        id="btn-add-person"
        outlined
        color="primary"
        :disabled="addEditInProgress"
        @click="initNewShareClass()"
      >
        <v-icon>mdi-plus</v-icon>
        <span>Add Share Class</span>
      </v-btn>
    </div>

    <v-expand-transition>
      <v-card flat class="add-share-structure-container" v-if="showAddShareStructureForm">
        <edit-share-structure
          :initialValue="currentShareStructure"
          :activeIndex="activeIndex"
          :shareId="shareId"
          :parentIndex="parentIndex"
          :shareClasses="shareClasses"
          :resolution-required="resolutionRequired"
          @addEditClass="addEditShareClass($event)"
          @resolutionPrompt="emitResolutionPrompt($event)"
          @resetEvent="resetData()"/>
      </v-card>
    </v-expand-transition>

    <v-data-table
      class="share-structure-table"
      :headers="headers"
      :items="shareClasses"
      disable-pagination
      disable-sort
      hide-default-footer
    >
      <template v-slot:item="row" class="share-data-table">

        <!-- Share Class Rows-->
        <tr
          v-if="!showClassEditForm[row.index]"
          :key="row.item.id"
          class="class-row"
          :class="[
            { 'class-row-has-series': row.item.series.length},
            { 'removed' : row.item.action === ActionTypes.REMOVED }
          ]"
        >
          <td :class="{ 'list-item__subtitle' : row.item.action === ActionTypes.REMOVED }" class="list-item__title">
            {{ row.item.name }}
            <action-chip v-if="row.item.action" :actionable-item="row.item" :is-correction="isCorrection" />
          </td>
          <td class="text-right">
            {{ row.item.maxNumberOfShares ? (+row.item.maxNumberOfShares).toLocaleString() : 'No Maximum' }}
          </td>
          <td class="text-right">{{ row.item.parValue ? `$${row.item.parValue}.00` : 'No Par Value' }}</td>
          <td>{{ row.item.currency }}</td>
          <td>{{ row.item.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>

          <!-- Share Class Action Btns -->
          <td class="actions-cell pt-4">
            <div class="actions">
              <!-- Share Class Correct Btn -->
              <span v-if="!row.item.action" class="edit-action">
                <v-btn text color="primary"
                       :id="'class-' + row.index + '-change-btn'"
                       @click="initShareClassForEdit(row.index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>{{editLabel(isCorrection)}}</span>
                </v-btn>
              </span>

              <!-- Share Class Undo Btn -->
              <span
                v-if="row.item.action === ActionTypes.EDITED || row.item.action === ActionTypes.REMOVED"
                class="undo-action"
              >
                <v-btn text color="primary"
                       :id="'class-' + row.index + '-undo-btn'"
                       @click="undoCorrection(true, row.item.action, row.index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>

              <!-- Share Class Edit Btn -->
              <span v-if="row.item.action === ActionTypes.ADDED" class="edit-action">
                <v-btn text color="primary"
                       :id="'class-' + row.index + '-change-added-btn'"
                       @click="initShareClassForEdit(row.index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>

              <!-- Share Class Dropdown Actions -->
              <span v-if="row.item.action !== ActionTypes.REMOVED">
                <v-menu offset-y left>
                  <template v-slot:activator="{ on }">
                    <v-btn text
                           color="primary"
                           class="actions__more-actions__btn"
                           :disabled="addEditInProgress"
                           v-on="on">
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="more-actions">
                    <v-list-item
                      v-if="row.item.action === ActionTypes.EDITED"
                      class="actions-dropdown_item"
                      @click="initShareClassForEdit(row.index)"
                      :disabled="addEditInProgress">
                      <v-list-item-subtitle>
                        <v-icon small>mdi-pencil</v-icon> {{editLabel(isCorrection)}}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': !row.item.hasRightsOrRestrictions }"
                      :disabled="!row.item.hasRightsOrRestrictions"
                      @click="initNewShareSeries(row.index)">
                      <v-list-item-subtitle>
                        <v-icon color="primary">mdi-playlist-plus</v-icon> Add Series
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': isMoveDisabled(row.index, 'up') }"
                      @click="moveIndex(row.index, 'up')"
                      :disabled="isMoveDisabled(row.index, 'up')"
                    >
                      <v-list-item-subtitle class="move-up-selector">
                        <v-icon>mdi-arrow-up</v-icon> Move Up
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': isMoveDisabled(row.index, 'down') }"
                      @click="moveIndex(row.index, 'down')"
                      :disabled="isMoveDisabled(row.index, 'down')"
                    >
                      <v-list-item-subtitle class="move-down-selector">
                        <v-icon>mdi-arrow-down</v-icon> Move Down
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      @click="confirmShareRemoval(row.index)"
                    >
                      <v-list-item-subtitle class="remove-selector">
                        <v-icon>mdi-delete</v-icon> Remove
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </td>
        </tr>

        <!-- Share Class Edit Form -->
        <tr v-if="showClassEditForm[row.index]">
          <td colspan="6">
            <v-expand-transition>
              <div class="edit-share-structure-container">
                <edit-share-structure
                  :initialValue="currentShareStructure"
                  :activeIndex="activeIndex"
                  :shareId="shareId"
                  :parentIndex="parentIndex"
                  :shareClasses="shareClasses"
                  :resolution-required="resolutionRequired"
                  @addEditClass="addEditShareClass($event)"
                  @addEditSeries="addEditShareSeries($event)"
                  @removeClass="confirmShareRemoval($event)"
                  @resolutionPrompt="emitResolutionPrompt($event)"
                  @resetEvent="resetData()"/>
              </div>
            </v-expand-transition>
          </td>
        </tr>

        <!-- Share Series rows -->
        <template v-for="(seriesItem, index) in row.item.series">
          <tr
            v-if="showSeriesEditForm[row.index] && !showSeriesEditForm[row.index][index]"
            :key="`class:${row.index}-Series:${index}`"
            class="series-row"
            :class="[
              { 'series-row-last': index === row.item.series.length - 1},
              { 'removed' : row.item.action === ActionTypes.REMOVED }
            ]"
          >
            <td class="series-name">
              <li>
                <span class="h3 ml-n2" :class="{'list-item__subtitle' : row.item.action === ActionTypes.REMOVED ||
                seriesItem.action === ActionTypes.REMOVED }">
                {{ seriesItem.name }}
              </span>
              </li>
              <action-chip
                v-if="row.item.action !== ActionTypes.REMOVED && seriesItem.action"
                :actionable-item="seriesItem"
                :is-correction="isCorrection"
              />
            </td>
            <td class="text-right">
              {{ seriesItem.maxNumberOfShares ? (+seriesItem.maxNumberOfShares).toLocaleString() : 'No Maximum' }}
            </td>
            <td class="text-right">{{ row.item.parValue ? `$${row.item.parValue}.00` : 'No Par Value' }}</td>
            <td>{{ row.item.currency }}</td>
            <td>{{ seriesItem.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>

            <!-- Share Series Edit Btn -->
            <td class="actions-cell pt-4">
              <div class="actions" v-if="row.item.action !== ActionTypes.REMOVED">
                <!-- Series Correct Btn -->
                <span v-if="!seriesItem.action" class="edit-action">
                  <v-btn text color="primary"
                         :id="'series-' + index + '-change-btn'"
                         @click="editSeries(row.index, index)"
                         :disabled="addEditInProgress"
                  >
                    <v-icon small>mdi-pencil</v-icon>
                    <span>{{editLabel(isCorrection)}}</span>
                  </v-btn>
                </span>

                <!-- Series Undo btn -->
                <span
                  v-else-if="row.item.hasRightsOrRestrictions && seriesItem.action !== ActionTypes.ADDED"
                  class="undo-action"
                >
                  <v-btn text color="primary"
                         :id="'series-' + index + '-undo-btn'"
                         @click="undoCorrection
                    (false, seriesItem.action, index, row.index, row.item.id, seriesItem.id)"
                         :disabled="addEditInProgress"
                  >
                    <v-icon small>mdi-undo</v-icon>
                    <span>Undo</span>
                  </v-btn>
                </span>

                <!-- Series Edit Btn -->
                <span v-else-if="seriesItem.action !== ActionTypes.REMOVED" class="edit-action">
                  <v-btn text color="primary"
                         :id="'series-' + index + '-change-added-btn'"
                         @click="editSeries(row.index, index)"
                         :disabled="addEditInProgress"
                  >
                    <v-icon small>mdi-pencil</v-icon>
                    <span>Edit</span>
                  </v-btn>
                </span>

                <!-- Share Series Dropdown Actions -->
                <span v-if="seriesItem.action !== ActionTypes.REMOVED">
                  <v-menu offset-y left>
                    <template v-slot:activator="{ on }">
                      <v-btn text color="primary"
                             class="actions__more-actions__btn" v-on="on"
                             :disabled="addEditInProgress"
                      >
                        <v-icon>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list class="more-actions">
                      <v-list-item
                        v-if="seriesItem.action === ActionTypes.EDITED"
                        class="actions-dropdown_item"
                        @click="editSeries(row.index, index)"
                        :disabled="addEditInProgress"
                      >
                      <v-list-item-subtitle>
                        <v-icon small>mdi-pencil</v-icon> {{editLabel(isCorrection)}}
                      </v-list-item-subtitle>
                    </v-list-item>
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'up', index) }"
                        @click="moveIndex(row.index, 'up', index)"
                        :disabled="isMoveDisabled(row.index, 'up', index)"
                      >
                        <v-list-item-subtitle class="move-up-selector">
                          <v-icon>mdi-arrow-up</v-icon> Move Up
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'down', index) }"
                        @click="moveIndex(row.index, 'down', index)"
                        :disabled="isMoveDisabled(row.index, 'down', index)"
                      >
                        <v-list-item-subtitle class="move-down-selector">
                          <v-icon>mdi-arrow-down</v-icon> Move Down
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item class="actions-dropdown_item" @click="removeSeries(index, row.index)">
                        <v-list-item-subtitle>
                          <v-icon>mdi-delete</v-icon> Remove
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
              </div>
            </td>
          </tr>
          <!-- Series Share Edit Form -->
          <tr
            v-if="showSeriesEditForm[row.index] && showSeriesEditForm[row.index][index]"
            :key="`class:${row.index}-Series:${index}-edit-form`"
          >
            <td colspan="6">
              <v-expand-transition>
                <div class="edit-share-structure-container">
                  <edit-share-structure
                    :initialValue="currentShareStructure"
                    :activeIndex="activeIndex"
                    :shareId="shareId"
                    :parentIndex="parentIndex"
                    :shareClasses="shareClasses"
                    :resolution-required="resolutionRequired"
                    @addEditClass="addEditShareClass($event)"
                    @addEditSeries="addEditShareSeries($event)"
                    @removeSeries="removeSeries($event, row.index)"
                    @resolutionPrompt="emitResolutionPrompt($event)"
                    @resetEvent="resetData()"/>
                </div>
              </v-expand-transition>
            </td>
          </tr>
        </template>

        <!-- Series Share Add Form -->
        <tr v-if="showSeriesAddForm[row.index]">
          <td colspan="6">
            <v-expand-transition>
              <div class="edit-share-structure-container">
                <edit-share-structure
                  :initialValue="currentShareStructure"
                  :activeIndex="activeIndex"
                  :shareId="shareId"
                  :parentIndex="parentIndex"
                  :shareClasses="shareClasses"
                  :resolution-required="resolutionRequired"
                  @addEditClass="addEditShareClass($event)"
                  @addEditSeries="addEditShareSeries($event)"
                  @removeSeries="removeSeries($event, row.index)"
                  @resolutionPrompt="emitResolutionPrompt($event)"
                  @resetEvent="resetData()"/>
              </div>
            </v-expand-transition>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import 'array.prototype.move'
import { cloneDeep, isEqual, omit } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

// Components
import { ActionChip } from '@/components/ActionChip'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import EditShareStructure from './EditShareStructure.vue'

// Mixins
import { CommonMixin } from '@/mixins'

import {
  BusinessSnapshotIF,
  ConfirmDialogType,
  IncorporationFilingIF,
  ShareClassIF
} from '@/interfaces'

// Interfaces or Enums
import { ActionTypes } from '@/enums'

@Component({
  components: {
    ActionChip,
    ConfirmDialog,
    EditShareStructure
  }
})
export default class ShareStructure extends Mixins(CommonMixin) {
  // Refs
  $refs!: Vue['$refs'] & {
    confirm: ConfirmDialogType,
  };

  // Props
  @Prop()
  private isCorrection: boolean

  @Prop({ default: null })
  private incorporationApplication: IncorporationFilingIF

  @Prop({ default: null })
  private businessSnapshot: BusinessSnapshotIF[]

  @Prop({ default: [] })
  private shareClasses: ShareClassIF[]

  @Prop({ default: false })
  private resolutionRequired: boolean

  // Local Properties
  private activeIndex: number = -1
  private parentIndex: number = -1
  private shareId: string = ''
  private showAddShareStructureForm = false
  private showClassEditForm: Array<boolean> = [false]
  private showSeriesAddForm: Array<boolean> = [false]
  private showSeriesEditForm: Array<any> = this.mapEmpty2dArray()
  private addEditInProgress = false
  private currentShareStructure: ShareClassIF = null
  private originalSnapshot: BusinessSnapshotIF[]
  private originalIA: IncorporationFilingIF

  // Declaration for template
  readonly ActionTypes = ActionTypes

  private headers: Array<any> = [
    {
      text: 'Name of Share Class or Series',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Maximum Number of Shares', value: 'maxNumberOfShares' },
    { text: 'Par Value', value: 'parValue' },
    { text: 'Currency', value: 'currency' },
    { text: 'Special Rights or Restrictions', value: 'hasRightsOrRestrictions' }
  ]

  private newShareClass: ShareClassIF = {
    id: null,
    priority: null,
    type: 'Class',
    name: '',
    hasMaximumShares: true,
    maxNumberOfShares: null,
    hasParValue: true,
    parValue: null,
    currency: 'CAD',
    hasRightsOrRestrictions: false,
    series: [],
    action: ActionTypes.ADDED
  }

  private newShareSeries: ShareClassIF = {
    id: null,
    priority: null,
    type: 'Series',
    name: '',
    hasMaximumShares: true,
    maxNumberOfShares: null,
    hasParValue: true,
    parValue: null,
    currency: null,
    hasRightsOrRestrictions: false,
    action: ActionTypes.ADDED
  }

  // Initialize data sets
  mounted () {
    this.updateOriginalIA()
    this.updateSnapshot()
  }

  /** True if we have any changes (from original IA). */
  private get hasClassChanges (): boolean {
    return this.shareClasses.some(x => x.action)
  }

  /** True if we have any changes (from original IA). */
  private get hasSeriesChanges (): boolean {
    return !!this.shareClasses.find(shareClass => shareClass.series.some(x => x.action))
  }

  // Share Class Functionality
  /**
   * Initialize the Add Share Class Form
   */
  private initNewShareClass (): void {
    this.activeIndex = -1
    this.parentIndex = -1
    this.currentShareStructure = { ...this.newShareClass }
    this.currentShareStructure.priority = this.shareClasses.length === 0
      ? 1
      : this.shareClasses[this.shareClasses.length - 1].priority + 1
    this.shareId = uuidv4() // assign a new (random) ID

    this.addEditInProgress = true
    this.showAddShareStructureForm = true
  }

  /**
   *  Initialize the Add Share Class Form to Edit existing ShareClass
   *  @param index The identifier of the ShareClass to be edited.
   */
  private initShareClassForEdit (index: number): void {
    this.currentShareStructure = { ...this.shareClasses[index] }
    this.activeIndex = index
    this.parentIndex = -1
    this.addEditInProgress = true
    this.showClassEditForm[index] = true
  }

  /**
   * Add / Edit Share Class and set to store
   * @param shareStructure The current share structure object
   */
  private addEditShareClass (shareStructure: ShareClassIF): void {
    // Apply a correction tag if Share is changed
    if (shareStructure.action !== ActionTypes.ADDED) {
      shareStructure.action = this.isShareClassEdited(shareStructure) ? ActionTypes.EDITED : null
    }

    let newList: ShareClassIF[] = [...this.shareClasses]
    // New Share Structure.
    if (this.activeIndex === -1) {
      newList.push(shareStructure)
    } else {
      // Edit Share Structure.
      newList.splice(this.activeIndex, 1, shareStructure)
    }
    this.emitShareClasses(newList)
    this.resetData()
  }

  /**
   * Compare ShareClass to its original to identify any changes
   * @params shareClass The Share class to compare
   */
  private isShareClassEdited (shareClass: ShareClassIF): boolean {
    const originalShareClasses: any = this.isCorrection
      ? cloneDeep(this.originalIA.incorporationApplication.shareStructure.shareClasses)
      : cloneDeep(this.originalSnapshot[4].shareClasses)

    const originalShareClass = originalShareClasses.find(
      share => share.id === shareClass.id
    )

    return !isEqual(
      { ...omit(shareClass, 'action') },
      { ...omit(originalShareClass, 'action') }
    )
  }

  /**
   * Remove the Share Class from the Store
   * @param index The share class identifier
   */
  private removeShareClass (index: number): void {
    // get share class to remove
    // make a copy so we don't change the item in the list
    const shareClass = { ...this.shareClasses[index] }
    let tempList: ShareClassIF[] = [...this.shareClasses]

    if (shareClass.action === ActionTypes.ADDED) {
      tempList.splice(index, 1)
    } else {
      shareClass.action = ActionTypes.REMOVED
      tempList.splice(index, 1, shareClass)
    }

    this.emitShareClasses(tempList)
    this.resetData()
  }

  /**
   * Restore the Share series from the Store
   * @param index The share class identifier
   */
  private restoreShareClass (index: number): void {
    const originalShareClasses: any = this.isCorrection
      ? cloneDeep(this.originalIA.incorporationApplication.shareStructure.shareClasses)
      : cloneDeep(this.originalSnapshot[4].shareClasses)

    // Fetch and identify the ShareClass to restore
    const shareClassToRestore = originalShareClasses.find(
      shareClass => shareClass.id === this.shareClasses[index].id
    )

    // Create a new ShareClass List and restore the original data
    let newList: ShareClassIF[] = [...this.shareClasses]
    newList[index] = { ...shareClassToRestore, series: [...shareClassToRestore.series] }

    newList.forEach(classShare => {
      // Reset series if corrected RightsOrRestrictions is no longer true
      if (!classShare.hasRightsOrRestrictions) classShare.series = []
    })

    this.emitShareClasses(newList)
    this.resetData()
  }

  // Series Functionality
  /**
   * Initialize the Add Series Form
   */
  private initNewShareSeries (shareClassIndex: number): void {
    this.activeIndex = -1
    this.parentIndex = shareClassIndex

    let newList: ShareClassIF[] = [...this.shareClasses]
    const parentShareClass = newList[shareClassIndex]
    const shareSeries = parentShareClass.series
    this.currentShareStructure = { ...this.newShareSeries }
    this.currentShareStructure.hasParValue = parentShareClass.hasParValue
    this.currentShareStructure.parValue = parentShareClass.parValue
    this.currentShareStructure.currency = parentShareClass.currency
    this.currentShareStructure.priority =
      shareSeries.length === 0 ? 1 : shareSeries[shareSeries.length - 1].priority + 1
    this.shareId = uuidv4()
    this.addEditInProgress = true
    this.showSeriesAddForm[shareClassIndex] = true
  }

  /**
   * Add / Edit Share Series and set to store
   */
  private addEditShareSeries (shareSeries: ShareClassIF): void {
    // Apply a correction tag if Share is changed
    if (shareSeries.action !== ActionTypes.ADDED && this.isShareClassEdited(shareSeries)) {
      shareSeries.action = ActionTypes.EDITED
    }

    let newList: ShareClassIF[] = [...this.shareClasses]
    const parentShareClass = newList[this.parentIndex]
    let series = [...parentShareClass.series]
    // New Share Structure.
    if (this.activeIndex === -1) {
      series.push(shareSeries)
    } else {
      // Edit Share Structure.
      series.splice(this.activeIndex, 1, shareSeries)
    }
    parentShareClass.series = series

    this.emitShareClasses(newList)
    this.resetData()
  }

  /**
   * Edit an existing series share
   * @param index The share class parent index
   * @param seriesIndex The share series index
   */
  private editSeries (index: number, seriesIndex: number): void {
    this.activeIndex = seriesIndex
    this.parentIndex = index
    let newList: ShareClassIF[] = [...this.shareClasses]
    this.currentShareStructure = { ...newList[this.parentIndex].series[this.activeIndex] }
    this.addEditInProgress = true
    this.showSeriesEditForm[index][seriesIndex] = true
  }

  /**
   * Remove the Series share from the Store
   * @param seriesIndex The series share identifier
   * @param parentIndex The parent class index
   */
  private removeSeries (seriesIndex: number, parentIndex: number): void {
    const shareSeries = { ...this.shareClasses[parentIndex].series[seriesIndex] }
    let tempList: ShareClassIF[] = [...this.shareClasses]

    if (shareSeries.action === ActionTypes.ADDED) {
      tempList[parentIndex].series.splice(seriesIndex, 1)
    } else {
      shareSeries.action = ActionTypes.REMOVED
      tempList[parentIndex].series.splice(seriesIndex, 1, shareSeries)
    }

    this.emitShareClasses(tempList)
    this.resetData()
  }

  /**
   * Restore the Share Series from the Store
   * @param seriesIndex The share series identifier
   * @param parentIndex The share series parent class index
   * @param parentId The Parent class Id
   * @param seriesId The Series Id
   */
  private restoreShareSeries (seriesIndex: number, parentIndex: number, parentId: string, seriesId: string): void {
    const originalShareClasses: any = this.isCorrection
      ? cloneDeep(this.originalIA.incorporationApplication.shareStructure.shareClasses)
      : cloneDeep(this.originalSnapshot[4].shareClasses)

    // Fetch the original Share class ( In the event the list is moved up or down, find the original by ID )
    const originalShareClass = Object.assign({},
      originalShareClasses.find(
        shareClass => shareClass.id === parentId
      )
    )

    // Fetch and identify the ShareSeries to restore
    const shareSeriesToRestore = Object.assign({},
      originalShareClass.series.find(
        shareSeries => shareSeries.id === seriesId
      ))

    // Create a new ShareSeries List and restore the original data
    let newList: ShareClassIF[] = [...this.shareClasses]
    newList[parentIndex].series[seriesIndex] = shareSeriesToRestore

    this.emitShareClasses(newList)
    this.resetData()
  }

  // Common form functionality
  /**
   * Adjust the priority of the list share class
   * @param indexFrom The index of the class
   * @param direction The direction of the move
   * @param seriesIndex The index of the series
   */
  private moveIndex (indexFrom: number, direction: string, seriesIndex: number = -1): void {
    let indexTo
    if (seriesIndex >= 0) {
      indexTo = direction === 'up' ? seriesIndex - 1 : seriesIndex + 1
      this.shareClasses[indexFrom].series[seriesIndex].priority = indexTo
      this.shareClasses[indexFrom].series[seriesIndex].priority = indexFrom;
      (this.shareClasses[indexFrom].series as any).move(seriesIndex, indexTo)
    } else {
      indexTo = direction === 'up' ? indexFrom - 1 : indexFrom + 1
      this.shareClasses[indexFrom].priority = indexTo
      this.shareClasses[indexTo].priority = indexFrom;
      (this.shareClasses as any).move(indexFrom, indexTo)
    }
  }

  /**
   * Determine if the move up / move down is enabled
   * @param index index of the class item
   * @param direction The direction of the move
   * @param seriesIndex index of the series item
   * @returns A boolean indicating if a move is enabled
   */
  private isMoveDisabled (index: number, direction: string, seriesIndex: number = -1): boolean {
    const seriesCheck = seriesIndex >= 0
    const arrBoundry = seriesCheck ? this.shareClasses[index].series.length - 1 : this.shareClasses.length - 1
    switch (direction) {
      case 'up':
        if (seriesCheck) {
          return seriesIndex === 0
        } else {
          return index === 0
        }
      case 'down':
        if (seriesCheck) {
          return seriesIndex === arrBoundry
        } else {
          return index === arrBoundry
        }
      default:
        return false
    }
  }

  /**
   * Undo the adding or editing of a Share class or series
   * @param isClass Boolean indicating if item is a Class Share
   * @param actionType The type of action to undo
   * @param index The identifier of which share class/series to undo
   * @param parentIndex The identifier of the parent class when handling series.
   * @param parentId The parent class Id.
   * @param seriesId The series Id.
   */
  private undoCorrection (
    isClass: boolean,
    actionType: ActionTypes,
    index: number,
    parentIndex: number = null,
    parentId: string = null,
    seriesId: string = null): void {
    switch (actionType) {
      case ActionTypes.ADDED:
        isClass ? this.removeShareClass(index) : this.removeSeries(index, parentIndex)
        break
      case ActionTypes.EDITED:
        isClass ? this.restoreShareClass(index) : this.restoreShareSeries(index, parentIndex, parentId, seriesId)
        break
      case ActionTypes.REMOVED:
        isClass ? this.restoreShareClass(index) : this.restoreShareSeries(index, parentIndex, parentId, seriesId)
        break
    }
  }

  /**
   * Clear and set local tracking properties to default
   */
  private resetData (): void {
    this.currentShareStructure = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showAddShareStructureForm = false
    this.showClassEditForm = [false]
    this.showSeriesAddForm = [false]
    this.showSeriesEditForm = this.mapEmpty2dArray()
    this.parentIndex = -1
    this.shareId = ''
    this.scrollToTop(this.$el)
  }

  private confirmShareRemoval (index: number): void {
    const shareClass = { ...this.shareClasses[index] }

    if (shareClass.series.length > 0) {
      // open confirmation dialog and wait for response
      this.$refs.confirm.open(
        'Remove Share Series with Class',
        'A share series exists for this class. Removing the share class will remove all associated share ' +
        'series.',
        {
          width: '45rem',
          persistent: true,
          yes: 'Remove',
          no: null,
          cancel: 'Cancel'
        }
      ).then(() => {
        // if we get here, Yes was clicked
        this.removeShareClass(index)
      }).catch(() => {
        // if we get here, Cancel was clicked
        this.resetData()
      })
    } else {
      this.removeShareClass(index)
    }
  }

  /** Map an empty 2d array to handle the unknown size of nested Share Classes and Series */
  private mapEmpty2dArray (): Array<any> {
    return new Array(50).fill(null).map(() => new Array(50).fill(null))
  }

  @Watch('businessSnapshot')
  private updateSnapshot (): void {
    this.originalSnapshot = cloneDeep(this.businessSnapshot)
  }

  @Watch('incorporationApplication')
  private updateOriginalIA (): void {
    this.originalIA = cloneDeep(this.incorporationApplication)
  }

  @Watch('hasClassChanges')
  @Watch('hasSeriesChanges')
  private emitHaveChanges (): void {
    this.emitShareStructureChanged(this.hasClassChanges || this.hasSeriesChanges)
  }

  /** Updates store when local Editing property has changed. */
  @Watch('addEditInProgress', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.emitEditingShareStructure(val)
  }

  @Emit('emitShareClasses')
  private emitShareClasses (shareClasses: ShareClassIF[]): void {}

  @Emit('emitShareStructureChanged')
  private emitShareStructureChanged (hasChanges: boolean): void {}

  @Emit('emitEditingShareStructure')
  private emitEditingShareStructure (isEditing: boolean): void {}

  @Emit('emitResolutionPrompt')
  private emitResolutionPrompt (requiresPrompt: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#share-structure {
  margin-top: 1rem;

  tbody {
    tr:hover {
      background-color: transparent !important;
    }
  }
}

.share-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .share-summary-header-title {
    padding-left: .5rem;
  }
}

.class-row td{
  height: 4rem !important;
  color: $gray9;
  font-size: 1rem !important;
  padding: 10px
}

.class-row td:not(:first-child) {
  color: $gray7;
  font-size: .875rem;
}

.removed td:not(:last-child) {
  color: rgba(73, 80, 87, .40) !important;
}

.class-row-has-series td:not(:last-child) {
  border-bottom: thin dashed rgba(0, 0, 0, 0.12)!important;
}

.series-row {
  td {
    height: 4rem !important;
    color: $gray9;
    font-size: .875rem;
    font-weight: bold;
    padding: 10px
  }

  .series-name {
    padding-left: 40px;
  }

  td:not(:last-child) {
    border-bottom: thin dashed rgba(0, 0, 0, 0.12)!important;
  }

  td:not(:first-child){
    color: $gray7;
    font-size: .875rem;
    font-weight: normal;
  }
}

.actions-cell {
  position: absolute;
  right: 0;
  border-bottom: none !important;
}

.actions {
  display: flex;
  justify-content: flex-end;

  .edit-action, .undo-action {
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: .5rem;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}

.more-actions {
  padding: 2px 0;

  .item-disabled {
    opacity: .5;
  }

  .actions-dropdown_item {
    min-height: 0!important;
    margin: 1rem 0;
  }
}

.theme--light.v-btn.v-btn--disabled, .theme--light.v-btn.v-btn--disabled .v-icon {
  color: $app-blue !important;
  opacity: .4;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.25);
  border: none !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th:nth-child(2) {
  max-width: 140px;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th:nth-child(5) {
  border-right: thin solid rgba(0, 0, 0, 0);
}

::v-deep .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: .875rem;
  color: $gray9;
  line-height: 1.25;
}

::v-deep .theme--light.v-list-item .v-list-item__subtitle {
  color: $app-blue !important;
}

::v-deep .theme--light.v-label {
  color: $gray7;
}

::v-deep .theme--light.v-input input {
  color: $gray9;
  font-weight: normal;
}
</style>
