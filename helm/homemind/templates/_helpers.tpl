{{- define "homemind.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "homemind.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "homemind.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "homemind.namespace" -}}
{{- if .Values.global.namespace -}}
{{- .Values.global.namespace -}}
{{- else if .Values.namespace.name -}}
{{- .Values.namespace.name -}}
{{- else -}}
{{- .Release.Namespace -}}
{{- end -}}
{{- end -}}

{{- define "homemind.labels" -}}
app.kubernetes.io/name: {{ include "homemind.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: homemind
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end -}}

{{- define "homemind.componentName" -}}
{{- printf "%s-%s" (include "homemind.fullname" .root) .component | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "homemind.componentLabels" -}}
{{ include "homemind.labels" .root }}
app.kubernetes.io/component: {{ .component }}
app: {{ include "homemind.componentName" . }}
{{- end -}}

{{- define "homemind.selectorLabels" -}}
app.kubernetes.io/name: {{ include "homemind.name" .root }}
app.kubernetes.io/instance: {{ .root.Release.Name }}
app.kubernetes.io/component: {{ .component }}
app: {{ include "homemind.componentName" . }}
{{- end -}}

{{- define "homemind.image" -}}
{{- $registry := .Values.global.registry -}}
{{- if .image.registry -}}
{{- $registry = .image.registry -}}
{{- end -}}
{{- if $registry -}}
{{- printf "%s/%s:%s" $registry .image.repository .image.tag -}}
{{- else -}}
{{- printf "%s:%s" .image.repository .image.tag -}}
{{- end -}}
{{- end -}}

{{- define "homemind.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- if .Values.serviceAccount.name -}}
{{- .Values.serviceAccount.name -}}
{{- else -}}
{{- printf "%s-sa" (include "homemind.fullname" .) -}}
{{- end -}}
{{- else -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{- define "homemind.mergeAnnotations" -}}
{{- $result := dict -}}
{{- range $k, $v := .base }}
{{- $_ := set $result $k $v -}}
{{- end -}}
{{- range $k, $v := .extra }}
{{- $_ := set $result $k $v -}}
{{- end -}}
{{- toYaml $result -}}
{{- end -}}
