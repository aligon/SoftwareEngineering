:set-state-ok t
(in-package "ACL2")
(include-book "list-utilities" :dir :teachpacks)
(include-book "io-utilities" :dir :teachpacks)

(defun copy-file (f-in f-out state)
	(mv-let (input-as-string error-open state)
			(file->string  f-in state)
		(if error-open
			(mv error-open state)
			(mv-let (error-close state)
					(string-list->file f-out
						(list input-as-string)
						state)
				(if error-close
					(mv error-close state)
					(mv (string-append "input-file: "
							(string-append f-in
								(string-append ", output-file: " f-out)))
						state))))))

(defun main (state) (copy-file "state.txt" "nextgen.txt" state))